
<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

// Homepage
$routes->get('/', 'Home::index');

// Authentication API
$routes->group('api/auth', ['filter' => 'cors'], static function (RouteCollection $routes) {
    // Signup and login
    $routes->post('signup', 'AuthController::signup');
    $routes->post('login', 'AuthController::login');

    // Session management
    $routes->get('me', 'AuthController::me');
    $routes->post('logout', 'AuthController::logout');

    // CORS preflight requests
    $routes->options('signup', static function () {
        return service('response')->setStatusCode(204);
    });

    $routes->options('login', static function () {
        return service('response')->setStatusCode(204);
    });

    $routes->options('me', static function () {
        return service('response')->setStatusCode(204);
    });

    $routes->options('logout', static function () {
        return service('response')->setStatusCode(204);
    });
});

// Security scan API
$routes->post('api/scan', 'ScanController::scan');

$routes->get(
    'api/scan/(:segment)/progress',
    'ScanController::progress/$1'
);

$routes->get(
    'api/scan/(:segment)/result',
    'ScanController::result/$1'
);
