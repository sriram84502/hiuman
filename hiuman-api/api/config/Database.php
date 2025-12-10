<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        $this->host = getenv('DB_HOST') ?: "127.0.0.1";
        $this->db_name = getenv('DB_NAME') ?: "hiuman_db";
        $this->username = getenv('DB_USER') ?: "root";
        $this->password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : "@sai4502";
        $this->port = getenv('DB_PORT') ?: "3306";
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;
            
            // Aiven requires SSL. If DB_SSL is set or we are on prod, we might need options.
            // For simplicity, we enable SSL verification skip to avoid dealing with CA files for now,
            // or we relies on defaults.
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
            ];

            // If port is not 3306, it's likely a cloud DB (Aiven), so we might want to ensure SSL is negotiated.
            if ($this->port != "3306") {
                $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false; // Allow self-signed/unknown CA
                $options[PDO::MYSQL_ATTR_SSL_KEY] = null; // Enforce SSL handshake
            }

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(["message" => "Database Connection Failed: " . $exception->getMessage()]);
            exit;
        }

        return $this->conn;
    }
}
?>
