<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;

class ScanController extends BaseController
{
    public function scan(): ResponseInterface
    {
        $data = $this->request->getJSON(true);

        if (!is_array($data) || empty($data['target'])) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Target URL is required.'
                ]);
        }

        $target = trim($data['target']);

        $projectRoot = dirname(__DIR__, 3);

        $scannerPath = $projectRoot
            . DIRECTORY_SEPARATOR
            . 'scanner'
            . DIRECTORY_SEPARATOR
            . 'main.py';

        $progressDirectory = $projectRoot
            . DIRECTORY_SEPARATOR
            . 'scanner'
            . DIRECTORY_SEPARATOR
            . 'progress';

        if (!file_exists($scannerPath)) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Python scanner was not found.'
                ]);
        }

        if (!is_dir($progressDirectory)) {
            mkdir($progressDirectory, 0777, true);
        }

        /*
         * Generate a unique scan ID.
         */
        $scanId = bin2hex(random_bytes(16));

        $progressFile = $progressDirectory
            . DIRECTORY_SEPARATOR
            . $scanId
            . '.json';

        $outputFile = $progressDirectory
            . DIRECTORY_SEPARATOR
            . $scanId
            . '.output';

        $batchFile = $progressDirectory
            . DIRECTORY_SEPARATOR
            . $scanId
            . '.bat';

        /*
         * Initial progress state.
         */
        $initialProgress = [
            'status' => 'starting',
            'current_check' => null,
            'completed' => 0,
            'total' => 57
        ];

        file_put_contents(
            $progressFile,
            json_encode($initialProgress, JSON_PRETTY_PRINT)
        );

        /*
         * Build a temporary Windows batch file.
         *
         * The batch file:
         * 1. Sets the progress file environment variable.
         * 2. Starts the Python scanner.
         * 3. Saves scanner output into the scan-specific output file.
         */
        $batchContent =
            '@echo off' . PHP_EOL .
            'set "CYALYSIS_PROGRESS_FILE=' . $progressFile . '"' . PHP_EOL .
            'python ' .
            escapeshellarg($scannerPath) .
            ' ' .
            escapeshellarg($target) .
            ' > ' .
            escapeshellarg($outputFile) .
            ' 2>&1' . PHP_EOL;

        file_put_contents($batchFile, $batchContent);

        /*
         * Start Python in the background.
         *
         * CodeIgniter does NOT wait for the scanner anymore.
         */
        $command = 'start /B "" ' . escapeshellarg($batchFile);

        pclose(
            popen($command, 'r')
        );

        /*
         * Return immediately.
         */
        return $this->response->setJSON([
            'status' => 'started',
            'scan_id' => $scanId,
            'message' => 'Scan started successfully.'
        ]);
    }


    public function progress(string $scanId): ResponseInterface
    {
        $projectRoot = dirname(__DIR__, 3);

        $progressFile = $projectRoot
            . DIRECTORY_SEPARATOR
            . 'scanner'
            . DIRECTORY_SEPARATOR
            . 'progress'
            . DIRECTORY_SEPARATOR
            . $scanId
            . '.json';

        if (!file_exists($progressFile)) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Scan progress was not found.'
                ]);
        }

        $contents = file_get_contents($progressFile);

        $progress = json_decode($contents, true);

        if (!is_array($progress)) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Invalid progress data.'
                ]);
        }

        return $this->response->setJSON($progress);
    }


    public function result(string $scanId): ResponseInterface
    {
        $projectRoot = dirname(__DIR__, 3);

        $outputFile = $projectRoot
            . DIRECTORY_SEPARATOR
            . 'scanner'
            . DIRECTORY_SEPARATOR
            . 'progress'
            . DIRECTORY_SEPARATOR
            . $scanId
            . '.output';

        if (!file_exists($outputFile)) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Scan result was not found.'
                ]);
        }

        $output = trim(file_get_contents($outputFile));

        if ($output === '') {
            return $this->response
                ->setStatusCode(202)
                ->setJSON([
                    'status' => 'running',
                    'message' => 'Scan result is not ready yet.'
                ]);
        }

        $result = json_decode($output, true);

        if (!is_array($result)) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'failed',
                    'error' => 'Invalid JSON returned by Python scanner.',
                    'details' => json_last_error_msg()
                ]);
        }

        $result['scan_id'] = $scanId;

        return $this->response->setJSON($result);
    }
}