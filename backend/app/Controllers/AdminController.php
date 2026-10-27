<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;

class AdminController extends BaseController
{
    public function dashboard(): ResponseInterface
    {
        $sessionUser = session()->get('user');

        if (!is_array($sessionUser) || empty($sessionUser['id'])) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON([
                    'message' => 'Please log in first.',
                ]);
        }

        $db = \Config\Database::connect();

        // Verify the role directly against the database.
        $admin = $db->table('users')
            ->select('id, name, email, role')
            ->where('id', (int) $sessionUser['id'])
            ->get()
            ->getRowArray();

        if (!$admin || $admin['role'] !== 'admin') {
            return $this->response
                ->setStatusCode(403)
                ->setJSON([
                    'message' => 'Administrator access required.',
                ]);
        }

        $counts = $db->table('scans')
            ->select("
                COUNT(*) AS total,
                COALESCE(SUM(status = 'running'), 0) AS running,
                COALESCE(SUM(status = 'queued'), 0) AS queued,
                COALESCE(SUM(status = 'completed'), 0) AS completed,
                COALESCE(SUM(status = 'failed'), 0) AS failed
            ", false)
            ->get()
            ->getRowArray();

        $userCount = $db->table('users')->countAllResults();

        $recentScans = $db->table('scans s')
            ->select(
                's.id, s.user_id, s.target_url, s.status, ' .
                's.started_at, s.completed_at, ' .
                'u.name AS user_name, u.email AS user_email'
            )
            ->join('users u', 'u.id = s.user_id', 'left')
            ->orderBy('s.id', 'DESC')
            ->limit(100)
            ->get()
            ->getResultArray();

        return $this->response->setJSON([
            'admin' => [
                'id' => (int) $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
            ],
            'stats' => [
                'users' => (int) $userCount,
                'total' => (int) ($counts['total'] ?? 0),
                'running' => (int) ($counts['running'] ?? 0),
                'queued' => (int) ($counts['queued'] ?? 0),
                'completed' => (int) ($counts['completed'] ?? 0),
                'failed' => (int) ($counts['failed'] ?? 0),
            ],
            'scans' => $recentScans,
            'generated_at' => date(DATE_ATOM),
        ]);
    }
}