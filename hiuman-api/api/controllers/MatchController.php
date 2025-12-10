<?php
class MatchController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getMatches() {
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : 0;

        // 1. Get current user personality
        $stmt = $this->conn->prepare("SELECT * FROM personalities WHERE user_id = :uid");
        $stmt->bindParam(':uid', $userId);
        $stmt->execute();
        $me = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$me) {
            http_response_code(404); echo json_encode(["message" => "Profile incomplete"]); return;
        }

        // 2. Fetch candidates (excluding self)
        $stmt = $this->conn->prepare("
            SELECT u.id, u.name, u.age, u.city, u.soft_identity_tag, p.* 
            FROM users u 
            JOIN personalities p ON u.id = p.user_id 
            WHERE u.id != :uid
        ");
        $stmt->bindParam(':uid', $userId);
        $stmt->execute();
        $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $matches = [];

        foreach ($candidates as $c) {
            // 3. DeepMatch Algorithm
            
            // Big Five Difference (lower is better, invert for score)
            // Dimensions: openness, conscientiousness, extraversion, agreeableness, emotional_stability
            // But we only have openness in seeded/update logic for now? 
            // Let's use what we have: openness, empathy, confidence, energy
            
            $diffSum = abs($me['openness'] - $c['openness']) + 
                       abs($me['empathy_level'] - $c['empathy_level']) +
                       abs($me['confidence'] - $c['confidence']);
            
            // Max possible diff approx 300.
            $traitScore = max(0, 100 - ($diffSum / 3));

            // Vibe Match: Exact vibe type match is bonus
            $vibeBonus = ($me['vibe_type'] === $c['vibe_type']) ? 20 : 0;
            
            // Energy Balance: Similar energy is good? Or complementary? Let's say similar.
            $energyDiff = abs($me['energy_level'] - $c['energy_level']);
            $energyScore = max(0, 100 - $energyDiff);

            // Total Score
            $finalScore = ($traitScore * 0.4) + ($energyScore * 0.4) + $vibeBonus;
            $finalScore = min(100, round($finalScore));

            $matches[] = [
                "user" => [
                    "id" => $c['id'],
                    "name" => $c['name'],
                    "age" => $c['age'],
                    "city" => $c['city'],
                    "tag" => $c['soft_identity_tag'],
                    "vibe" => $c['vibe_type']
                ],
                "compatibility_score" => $finalScore,
                "vibe_score" => $energyScore // Proxy for vibe sync
            ];
        }

        // Sort by Score DESC
        usort($matches, function($a, $b) {
            return $b['compatibility_score'] <=> $a['compatibility_score'];
        });

        echo json_encode(array_slice($matches, 0, 7));
    }
}
?>
