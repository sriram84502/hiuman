<?php
class CircleController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getCircles() {
        $query = "SELECT * FROM circles LIMIT 10";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $circles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($circles);
    }
}
?>
