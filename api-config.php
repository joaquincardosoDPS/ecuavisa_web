<?php
/**
 * API Endpoint for Social Configuration
 * This replaces the TypeScript ConfigService for the React frontend
 * Usage: GET /api/config.php?client=dps
 */

// Set headers for JSON API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include the ConfigService class
require_once __DIR__ . '/config.php';

try {
    // Get client from query parameters
    $client = $_GET['client'] ?? $_POST['client'] ?? 'dps';
    
    // Validate client parameter
    if (empty($client)) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Client parameter is required',
            'status' => 'error'
        ]);
        exit();
    }
    
    // Get configuration using ConfigService
    $config = ConfigService::getSocialConfig($client);
    
    // Return configuration in the same format as TypeScript version
    http_response_code(200);
    echo json_encode([
        'data' => $config,
        'status' => 'success',
        'client' => $client,
        'timestamp' => date('c')
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error: ' . $e->getMessage(),
        'status' => 'error',
        'timestamp' => date('c')
    ]);
    
    // Log error for debugging
    error_log("API Config Error: " . $e->getMessage());
}
?>
