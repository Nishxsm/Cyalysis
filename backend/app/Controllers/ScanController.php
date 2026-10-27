<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;

class ScanController extends BaseController
{
    private const SCAN_TIMEOUT_SECONDS = 600;
    private const TOTAL_CHECKS = 57;

    /**
     * Get the authenticated user's ID from the login session.
     */
    private function authenticatedUserId(): ?int
    {
        $user = session()->get('user');

        if (!is_array($user) || empty($user['id'])) {
            return null;
        }

        return (int) $user['id'];
    }

    /**
     * Build the path to a scanner progress/output file.
     */
    private function scanFile(int $scanId, string $extension): string
    {
        return dirname(__DIR__, 3)
            . DIRECTORY_SEPARATOR . 'scanner'
            . DIRECTORY_SEPARATOR . 'progress'
            . DIRECTORY_SEPARATOR . $scanId . '.' . $extension;
    }

    /**
     * Write progress data without adding a scan_results table.
     */
    private function writeProgress(int $scanId, array $progress): void
    {
        $file = $this->scanFile($scanId, 'json');

        if (
            file_put_contents(
                $file,
                json_encode($progress, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
                LOCK_EX
            ) === false
        ) {
            log_message('error', 'Could not write progress for scan ' . $scanId);
        }
    }

    /**
     * Mark a queued/running scan as failed if it exceeds 10 minutes.
     *
     * This is request-triggered: it runs when progress or result is requested.
     */
    private function failIfTimedOut(
        array $scan,
        int $scanId,
        int $userId,
        $db
    ): bool {
        if (!in_array($scan['status'], ['queued', 'running'], true)) {
            return $scan['status'] === 'failed';
        }

        $startedAt = strtotime((string) ($scan['started_at'] ?? ''));

        if (
            $startedAt === false ||
            (time() - $startedAt) < self::SCAN_TIMEOUT_SECONDS
        ) {
            return false;
        }

        $now = date('Y-m-d H:i:s');

        $db->table('scans')
            ->where('id', $scanId)
            ->where('user_id', $userId)
            ->whereIn('status', ['queued', 'running'])
            ->update([
                'status' => 'failed',
                'completed_at' => $now,
            ]);

        $updatedScan = $db->table('scans')
            ->where('id', $scanId)
            ->where('user_id', $userId)
            ->get()
            ->getRowArray();

        if (!$updatedScan || $updatedScan['status'] !== 'failed') {
            return false;
        }

        $this->writeProgress($scanId, [
            'status' => 'failed',
            'current_check' => null,
            'completed' => 0,
            'total' => self::TOTAL_CHECKS,
            'error' => 'Scan timed out after 10 minutes.',
        ]);

        log_message('warning', 'Scan ' . $scanId . ' timed out.');

        return true;
    }

    /**
     * Start a scan and save its history.
     */
    public function scan(): ResponseInterface
    {
        $userId = $this->authenticatedUserId();

        if (!$userId) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Please log in to start a scan.',
                ]);
        }

        $data = $this->request->getJSON(true);

        if (!is_array($data) || empty($data['target'])) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Target URL is required.',
                ]);
        }

        $target = trim((string) $data['target']);
        $scheme = strtolower((string) parse_url($target, PHP_URL_SCHEME));
        $host = parse_url($target, PHP_URL_HOST);

        if (
            !filter_var($target, FILTER_VALIDATE_URL) ||
            !in_array($scheme, ['http', 'https'], true) ||
            !$host
        ) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Enter a valid HTTP or HTTPS URL.',
                ]);
        }

        if (strlen($target) > 2048) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'The target URL is too long.',
                ]);
        }

        $projectRoot = dirname(__DIR__, 3);

        $scannerPath = $projectRoot
            . DIRECTORY_SEPARATOR . 'scanner'
            . DIRECTORY_SEPARATOR . 'main.py';

        $progressDirectory = $projectRoot
            . DIRECTORY_SEPARATOR . 'scanner'
            . DIRECTORY_SEPARATOR . 'progress';

        if (!is_file($scannerPath)) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Python scanner was not found.',
                ]);
        }

        if (
            !is_dir($progressDirectory) &&
            !mkdir($progressDirectory, 0777, true) &&
            !is_dir($progressDirectory)
        ) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Could not create the scanner progress directory.',
                ]);
        }

        $db = \Config\Database::connect();

        try {
            $db->transStart();

            $db->table('scans')->insert([
                'user_id' => $userId,
                'target_url' => $target,
                'status' => 'queued',
                'started_at' => date('Y-m-d H:i:s'),
            ]);

            $scanId = (int) $db->insertID();

            $db->transComplete();

            if ($db->transStatus() === false || $scanId <= 0) {
                throw new \RuntimeException('Could not save scan history.');
            }
        } catch (\Throwable $e) {
            log_message(
                'error',
                'Could not save scan history: ' . $e->getMessage()
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Could not save scan history.',
                ]);
        }

        $progressFile = $this->scanFile($scanId, 'json');
        $outputFile = $this->scanFile($scanId, 'output');
        $batchFile = $this->scanFile($scanId, 'bat');

        try {
            $initialProgress = [
                'status' => 'starting',
                'current_check' => null,
                'completed' => 0,
                'total' => self::TOTAL_CHECKS,
            ];

            if (
                file_put_contents(
                    $progressFile,
                    json_encode($initialProgress, JSON_PRETTY_PRINT),
                    LOCK_EX
                ) === false
            ) {
                throw new \RuntimeException(
                    'Could not create the progress file.'
                );
            }

            // Remove old output so it cannot be mistaken for this scan's result.
            foreach ([$outputFile, $this->scanFile($scanId, 'error')] as $file) {
                if (is_file($file) && !unlink($file)) {
                    throw new \RuntimeException(
                        'Could not clear an old scanner output file.'
                    );
                }
            }

            // Preserve the original batch-file launcher.
            $batchContent =
                '@echo off' . PHP_EOL .
                'set "CYALYSIS_PROGRESS_FILE=' . $progressFile . '"' . PHP_EOL .
                'python ' .
                escapeshellarg($scannerPath) . ' ' .
                escapeshellarg($target) .
                ' > ' . escapeshellarg($outputFile) .
                ' 2> ' . escapeshellarg($this->scanFile($scanId, 'error')) .
                PHP_EOL .
                'echo %ERRORLEVEL% > ' .
                escapeshellarg($this->scanFile($scanId, 'exitcode')) .
                PHP_EOL;

            if (file_put_contents($batchFile, $batchContent) === false) {
                throw new \RuntimeException(
                    'Could not create the scanner batch file.'
                );
            }

            $db->table('scans')
                ->where('id', $scanId)
                ->where('user_id', $userId)
                ->update([
                    'status' => 'running',
                ]);

            $command = 'start /B "" ' . escapeshellarg($batchFile);
            $process = popen($command, 'r');

            if ($process === false) {
                throw new \RuntimeException(
                    'Could not launch the scanner process.'
                );
            }

            pclose($process);
        } catch (\Throwable $e) {
            log_message(
                'error',
                'Could not start scan ' . $scanId . ': ' . $e->getMessage()
            );

            $db->table('scans')
                ->where('id', $scanId)
                ->where('user_id', $userId)
                ->update([
                    'status' => 'failed',
                    'completed_at' => date('Y-m-d H:i:s'),
                ]);

            $this->writeProgress($scanId, [
                'status' => 'failed',
                'current_check' => null,
                'completed' => 0,
                'total' => self::TOTAL_CHECKS,
                'error' => 'Could not start the scanner.',
            ]);

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'scan_id' => $scanId,
                    'error' => 'Could not start the scanner.',
                ]);
        }

        return $this->response->setJSON([
            'status' => 'started',
            'scan_id' => $scanId,
            'message' => 'Scan started and saved to your history.',
        ]);
    }

    /**
     * Read progress only for scans owned by the logged-in user.
     */
    public function progress(string $scanId): ResponseInterface
    {
        $userId = $this->authenticatedUserId();

        if (!$userId) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Please log in.',
                ]);
        }

        if (!ctype_digit($scanId) || (int) $scanId <= 0) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Invalid scan ID.',
                ]);
        }

        $scanId = (int) $scanId;
        $db = \Config\Database::connect();

        $scan = $db->table('scans')
            ->where('id', $scanId)
            ->where('user_id', $userId)
            ->get()
            ->getRowArray();

        if (!$scan) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Scan not found.',
                ]);
        }

        if ($this->failIfTimedOut($scan, $scanId, $userId, $db)) {
            return $this->response->setJSON([
                'status' => 'failed',
                'current_check' => null,
                'completed' => 0,
                'total' => self::TOTAL_CHECKS,
                'error' => 'Scan timed out after 10 minutes.',
            ]);
        }

        $progressFile = $this->scanFile($scanId, 'json');

        if (!is_file($progressFile)) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Scan progress was not found.',
                ]);
        }

        $contents = file_get_contents($progressFile);
        $progress = $contents !== false
            ? json_decode($contents, true)
            : null;

        if (!is_array($progress)) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Invalid progress data.',
                ]);
        }

        return $this->response->setJSON($progress);
    }

    /**
     * Return scan results without storing them in a separate table.
     */
    public function result(string $scanId): ResponseInterface
    {
        $userId = $this->authenticatedUserId();

        if (!$userId) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Please log in.',
                ]);
        }

        if (!ctype_digit($scanId) || (int) $scanId <= 0) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Invalid scan ID.',
                ]);
        }

        $scanId = (int) $scanId;
        $db = \Config\Database::connect();

        $scan = $db->table('scans')
            ->where('id', $scanId)
            ->where('user_id', $userId)
            ->get()
            ->getRowArray();

        if (!$scan) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Scan not found.',
                ]);
        }

        if ($this->failIfTimedOut($scan, $scanId, $userId, $db)) {
            return $this->response
                ->setStatusCode(410)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Scan timed out after 10 minutes.',
                ]);
        }

        if ($scan['status'] === 'failed') {
            return $this->response
                ->setStatusCode(410)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'This scan has failed.',
                ]);
        }

        $outputFile = $this->scanFile($scanId, 'output');

        if (!is_file($outputFile)) {
            return $this->response
                ->setStatusCode(202)
                ->setJSON([
                    'status' => 'running',
                    'message' => 'Scan result is not ready yet.',
                ]);
        }

        $output = trim((string) file_get_contents($outputFile));

        if ($output === '') {
            return $this->response
                ->setStatusCode(202)
                ->setJSON([
                    'status' => 'running',
                    'message' => 'Scan result is not ready yet.',
                ]);
        }

        $result = json_decode($output, true);

        if (!is_array($result)) {
            $errorFile = $this->scanFile($scanId, 'error');
            $details = is_file($errorFile)
                ? trim((string) file_get_contents($errorFile))
                : '';

            $db->table('scans')
                ->where('id', $scanId)
                ->where('user_id', $userId)
                ->whereIn('status', ['queued', 'running'])
                ->update([
                    'status' => 'failed',
                    'completed_at' => date('Y-m-d H:i:s'),
                ]);

            $this->writeProgress($scanId, [
                'status' => 'failed',
                'current_check' => null,
                'completed' => 0,
                'total' => self::TOTAL_CHECKS,
                'error' => 'Invalid JSON returned by Python scanner.',
            ]);

            log_message(
                'error',
                'Invalid scanner output for scan ' . $scanId . ': ' .
                ($details !== '' ? $details : json_last_error_msg())
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Invalid JSON returned by Python scanner.',
                ]);
        }

        $db->table('scans')
            ->where('id', $scanId)
            ->where('user_id', $userId)
            ->whereIn('status', ['queued', 'running'])
            ->update([
                'status' => 'completed',
                'completed_at' => date('Y-m-d H:i:s'),
            ]);

        $result['scan_id'] = $scanId;

        return $this->response->setJSON($result);
    }
}