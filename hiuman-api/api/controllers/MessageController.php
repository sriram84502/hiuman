<?php
class MessageController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getMessages() {
        $matchId = isset($_GET['match_id']) ? $_GET['match_id'] : null;
        if (!$matchId) {
            http_response_code(400); echo json_encode(["message" => "Match ID required"]); return;
        }

        $query = "SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE match_id = :mid ORDER BY created_at ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':mid', $matchId);
        $stmt->execute();
        
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($messages);
    }

    public function sendMessage() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(!isset($data->match_id) || !isset($data->sender_id) || !isset($data->content)) {
            http_response_code(400); echo json_encode(["message" => "Incomplete data"]); return;
        }

        $query = "INSERT INTO messages (match_id, sender_id, content) VALUES (:mid, :sid, :content)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':mid', $data->match_id);
        $stmt->bindParam(':sid', $data->sender_id);
        $stmt->bindParam(':content', $data->content);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Message sent"]);
        } else {
            http_response_code(500); echo json_encode(["message" => "Failed to send"]);
        }
    }
}
?>
