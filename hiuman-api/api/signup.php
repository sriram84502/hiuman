<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

// Mock database save
$response = [
    "status" => "success",
    "message" => "User registered successfully",
    "data" => $data
];

echo json_encode($response);
?>
