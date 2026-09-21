<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->post('api/scan', 'ScanController::scan');

$routes->get(
    'api/scan/(:segment)/progress',
    'ScanController::progress/$1'
);

$routes->get(
    'api/scan/(:segment)/result',
    'ScanController::result/$1'
);