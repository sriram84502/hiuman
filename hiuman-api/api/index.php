<?php
// Main API Router

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helpers
include_once 'config/Database.php';

// Parse URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/', trim($uri, '/'));

// Expected Structure: /api/{resource}/{action}
// $parts[0] should be 'api' (if served from root) or project folder.
// Let's assume server root is hiuman-api/, so localhost:8000/api/auth/login -> parts: [api, auth, login]
// Adjust based on nesting.
$baseIndex = 0;
if ($parts[$baseIndex] !== 'api') {
    // try next
    $baseIndex++;
}

if (!isset($parts[$baseIndex+1])) {
    echo json_encode(["message" => "Welcome to HIUMAN API"]);
    exit;
}

$resource = $parts[$baseIndex+1]; // e.g., 'auth', 'matches'
$action = isset($parts[$baseIndex+2]) ? $parts[$baseIndex+2] : null; // e.g., 'login'
$id = isset($parts[$baseIndex+3]) ? $parts[$baseIndex+3] : null;

// Route
switch ($resource) {
    case 'auth':
        include_once 'controllers/AuthController.php';
        $controller = new AuthController();
        if ($action === 'register') $controller->register();
        elseif ($action === 'login') $controller->login();
        else { http_response_code(404); echo json_encode(["message" => "Auth Endpoint Not Found"]); }
        break;

    case 'matches':
        include_once 'controllers/MatchController.php';
        $controller = new MatchController();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') $controller->getMatches();
        break;
        
    case 'ai':
        include_once 'controllers/AIController.php';
        $controller = new AIController();
        if ($action === 'opener') $controller->getOpener();
        elseif ($action === 'ghosting-guardian') $controller->ghostingCheck();
        elseif ($action === 'breakup-coach') $controller->breakupCoach();
        break;

    case 'profile':
        include_once 'controllers/UserController.php';
        $controller = new UserController();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') $controller->updateProfile();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') $controller->getProfile();
        break;
        
    case 'karma':
        include_once 'controllers/KarmaController.php';
        $controller = new KarmaController();
        $controller->getKarma();
        break;

    case 'circles':
        include_once 'controllers/CircleController.php';
        $controller = new CircleController();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') $controller->getCircles();
        break;

    case 'games':
        include_once 'controllers/GameController.php';
        $controller = new GameController();
        if ($action === 'truth-or-comfort') $controller->getQuestions();
        break;

    case 'messages':
        include_once 'controllers/MessageController.php';
        $controller = new MessageController();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') $controller->getMessages();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') $controller->sendMessage();
        break;

    case 'vibes':
        include_once 'controllers/VibeController.php';
        $controller = new VibeController();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') $controller->logVibe();
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint Not Found"]);
        break;
}
?>
