<?php
class AIController {
    public function getOpener() {
        $lines = [
            "I see you're into deep talks. What's one unpopular opinion you hold?",
            "Your vibe is chaotic in the best way. What's the most impulsive thing you've done?",
            "If we were trapped in a mall overnight, which store would we raid first?",
            "Rating: 10/10 vibe. What's your go-to karaoke song?"
        ];
        echo json_encode(["line" => $lines[array_rand($lines)]]);
    }

    public function ghostingCheck() {
        echo json_encode([
            "status" => "active",
            "advice" => "Conversation looks healthy! Keep it up."
        ]);
    }

    public function breakupCoach() {
        echo json_encode([
            "day" => 1,
            "tip" => "It's okay to cry. Let it out.",
            "task" => "Write down 3 things you didn't like about the relationship. Burn the paper."
        ]);
    }
}
?>
