<?php
class AuthController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(!isset($data->email) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data"]);
            return;
        }

        // Check if email exists
        $check = "SELECT id FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($check);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();
        
        if($stmt->rowCount() > 0){
             http_response_code(409);
             echo json_encode(["message" => "Email already exists"]);
             return;
        }

        // Insert User
        $query = "INSERT INTO users (email, password_hash, name, age, city, gender) VALUES (:email, :password, :name, 20, 'Internet', 'Fluid')";
        $stmt = $this->conn->prepare($query);

        $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
        $name = isset($data->name) ? $data->name : 'New HIUMAN';

        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $password_hash);
        $stmt->bindParam(':name', $name);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "User created successfully", "user_id" => $this->conn->lastInsertId()]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create user"]);
        }
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "SELECT id, name, password_hash FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($data->password, $row['password_hash'])) {
                http_response_code(200);
                // Return simple token (ID for MVP)
                echo json_encode([
                    "message" => "Login successful",
                    "token" => base64_encode($row['id']),
                    "user" => ["id" => $row['id'], "name" => $row['name']]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["message" => "Invalid password"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["message" => "User not found"]);
        }
    }
}
?>
