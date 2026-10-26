<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;

class AuthController extends BaseController
{
    private function payload(): array
    {
        return $this->request->getJSON(true) ?? [];
    }

    private function json(array $data, int $status = 200): ResponseInterface
    {
        return $this->response
            ->setStatusCode($status)
            ->setJSON($data);
    }

    public function signup(): ResponseInterface
    {
        $data = $this->payload();

        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $confirmPassword = (string) ($data['confirmPassword'] ?? '');

        if ($name === '' || strlen($name) > 100) {
            return $this->json([
                'message' => 'Please enter a valid name.',
            ], 422);
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)
            || strlen($email) > 255) {
            return $this->json([
                'message' => 'Please enter a valid email address.',
            ], 422);
        }

        if (strlen($password) < 8) {
            return $this->json([
                'message' => 'Password must contain at least 8 characters.',
            ], 422);
        }

        if ($password !== $confirmPassword) {
            return $this->json([
                'message' => 'Passwords do not match.',
            ], 422);
        }

        $db = db_connect();

        $existingUser = $db->table('users')
            ->where('email', $email)
            ->get()
            ->getRowArray();

        if ($existingUser) {
            return $this->json([
                'message' => 'An account with this email already exists.',
            ], 409);
        }

        $db->table('users')->insert([
            'name' => $name,
            'email' => $email,
            'password_hash' => password_hash(
                $password,
                PASSWORD_DEFAULT
            ),
        ]);

        $userId = (int) $db->insertID();

        session()->regenerate(true);

        session()->set('user', [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
        ]);

        return $this->json([
            'message' => 'Account created successfully.',
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
            ],
        ], 201);
    }

    public function login(): ResponseInterface
    {
        $data = $this->payload();

        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if ($email === '' || $password === '') {
            return $this->json([
                'message' => 'Email and password are required.',
            ], 422);
        }

        $db = db_connect();

        $user = $db->table('users')
            ->where('email', $email)
            ->get()
            ->getRowArray();

        if (
            ! $user ||
            ! password_verify($password, $user['password_hash'])
        ) {
            return $this->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        session()->regenerate(true);

        $sessionUser = [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
        ];

        session()->set('user', $sessionUser);

        return $this->json([
            'message' => 'Login successful.',
            'user' => $sessionUser,
        ]);
    }

    public function me(): ResponseInterface
    {
        $user = session()->get('user');

        if (! $user) {
            return $this->json([
                'message' => 'Not authenticated.',
            ], 401);
        }

        return $this->json([
            'user' => $user,
        ]);
    }

    public function logout(): ResponseInterface
    {
        session()->remove('user');
        session()->destroy();

        return $this->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
