<?php
$host = "127.0.0.1";
$username = "root";
$password = "@sai4502";

try {
    // 1. Connect without DB
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to MySQL successfully.\n";

    // 2. Create DB
    $pdo->exec("CREATE DATABASE IF NOT EXISTS hiuman_db");
    echo "Database hiuman_db created/checked.\n";
    
    // 3. Select DB
    $pdo->exec("USE hiuman_db");
    
    // 4. Read Schema
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    if (!$schema) {
        die("Error: Could not read schema.sql\n");
    }

    // 5. Run queries (Split by ; usually works for simple schemas, or run whole if supported)
    // PDO doesn't support running multiple statements in one go easily unless emulated prepares are on, 
    // but usually exec() can handle it if the driver allows.
    // Let's try executing full batch.
    $pdo->exec($schema);
    
    echo "Schema imported successfully.\n";

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage() . "\n");
}
?>
