<?php
class UserController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getProfile() {
        // Assume user_id from token/session. For MVP we pass ?user_id=X or header
        // For security, would decode JWT. Here picking from query for demo.
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        if(!$userId) {
            http_response_code(400); echo json_encode(["message" => "User ID required"]); return;
        }

        $query = "SELECT u.*, p.* FROM users u LEFT JOIN personalities p ON u.id = p.user_id WHERE u.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if($user) {
            // Calculate pseudo HIUMAN Score
            $score = ($user['openness'] + $user['empathy_level'] + $user['conscientiousness']) / 3;
            $user['hiuman_score'] = round($score);
            echo json_encode($user);
        } else {
            http_response_code(404); echo json_encode(["message" => "User not found"]);
        }
    }

    public function updateProfile() {
        $data = json_decode(file_get_contents("php://input"));
        $userId = $data->user_id; // In real app, get from Auth context

        // Upsert Personality
        // Check if exists
        $check = "SELECT id FROM personalities WHERE user_id = :uid";
        $stmt = $this->conn->prepare($check);
        $stmt->bindParam(':uid', $userId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $query = "UPDATE personalities SET 
                mbti=:mbti, vibe_type=:vibe, energy_level=:energy, 
                openness=:openness, empathy_level=:empathy 
                WHERE user_id=:uid";
        } else {
            $query = "INSERT INTO personalities (user_id, mbti, vibe_type, energy_level, openness, empathy_level) 
                VALUES (:uid, :mbti, :vibe, :energy, :openness, :empathy)";
        }

        $stmt = $this->conn->prepare($query);
        
        // Defaults if missing
        $mbti = $data->mbti ?? 'INTJ'; 
        $vibe = $data->vibe_type ?? 'chill';
        $energy = $data->energy_level ?? 50;
        $openness = $data->openness ?? 50;
        $empathy = $data->empathy_level ?? 50;

        $stmt->bindParam(':uid', $userId);
        $stmt->bindParam(':mbti', $mbti);
        $stmt->bindParam(':vibe', $vibe);
        $stmt->bindParam(':energy', $energy);
        $stmt->bindParam(':openness', $openness);
        $stmt->bindParam(':empathy', $empathy);

        if($stmt->execute()) {
            echo json_encode(["message" => "Profile updated"]);
        } else {
            http_response_code(500); echo json_encode(["message" => "Update failed"]);
        }
    }
}
?>
