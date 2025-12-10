<?php
class VibeController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function logVibe() {
        $data = json_decode(file_get_contents("php://input"));
        
        $score = isset($data->vibe_score) ? $data->vibe_score : 50;
        $userId = isset($data->user_id) ? $data->user_id : null; // Optional

        $query = "INSERT INTO vibes (user_id, vibe_score) VALUES (:uid, :score)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':uid', $userId);
        $stmt->bindParam(':score', $score);

        if($stmt->execute()) {
             // Return some dummy matches or recommendations as requested
             echo json_encode([
                 "message" => "Vibe logged",
                 "recommendations" => [
                     ["name" => "Riya", "vibe" => "Chill", "match" => "92%"],
                     ["name" => "Arjun", "vibe" => "Chaotic", "match" => "88%"]
                 ]
             ]);
        } else {
            http_response_code(500); echo json_encode(["message" => "Failed to log"]);
        }
    }
}
?>
