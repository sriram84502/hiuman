<?php
class KarmaController {
    public function getKarma() {
        // Mock data for demo
        echo json_encode([
            "points" => 120,
            "level" => "Silver Human",
            "respect_score" => 4.5
        ]);
    }
}
?>
