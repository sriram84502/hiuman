<?php
// setup.php
// Visit http://localhost:8000/setup.php to run this.

header("Content-Type: text/html");

$host = "127.0.0.1";
$username = "root";
$password = "@sai4502"; 

function trySetup($host, $username, $password) {
    echo "<h3>Attempting connection to $host...</h3>";
    try {
        $pdo = new PDO("mysql:host=$host", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "<div style='color:green'>✔ Connected to MySQL successfully.</div>";

        $pdo->exec("CREATE DATABASE IF NOT EXISTS hiuman_db");
        echo "<div>✔ Database 'hiuman_db' created/checked.</div>";
        
        $pdo->exec("USE hiuman_db");
        
        $schemaPath = __DIR__ . '/schema.sql';
        if (!file_exists($schemaPath)) {
            throw new Exception("Schema file not found at $schemaPath");
        }
        $schema = file_get_contents($schemaPath);
        
        // Split by semicolon to execute individually if needed, but exec usually handles it.
        // For robustness with PDO, let's try raw exec.
        $pdo->exec($schema);
        echo "<div style='color:green'>✔ Schema imported successfully.</div>";
        echo "<h3>Setup Complete! You can now use the app.</h3>";
        return true;

    } catch (PDOException $e) {
        if ($e->getCode() == '23000' || strpos($e->getMessage(), 'Duplicate entry') !== false) {
             echo "<div style='color:blue'>ℹ️ Data already exists (Duplicate entry). You are ready!</div>";
             echo "<h3>Setup Complete! You can now use the app.</h3>";
             return true;
        }
        echo "<div style='color:red'>✘ Error: " . $e->getMessage() . "</div>";
        return false;
    }
}

echo "<h1>HIUMAN Database Setup</h1>";

// Try 127.0.0.1 (TCP)
if (!trySetup("127.0.0.1", $username, $password)) {
    echo "<hr><h3>Retrying with 'localhost' (Socket)...</h3>";
    
    // Common Mac Socket Paths
    $sockets = [
        '/tmp/mysql.sock',
        '/var/mysql/mysql.sock',
        '/usr/local/mysql/data/mysql.sock',
        '/Applications/MAMP/tmp/mysql/mysql.sock',
        '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
    ];

    $success = false;
    foreach ($sockets as $socket) {
        if (file_exists($socket)) {
            echo "Found socket at: $socket<br>";
             // Tweak host to use socket
             // PDO format: mysql:unix_socket=/path/to/socket;dbname=...
             if (trySetup("localhost;unix_socket=$socket", $username, $password)) {
                 $success = true;
                 break;
             }
        }
    }
    
    if (!$success) {
        // Fallback to standard localhost
        trySetup("localhost", $username, $password);
    }
}
?>
