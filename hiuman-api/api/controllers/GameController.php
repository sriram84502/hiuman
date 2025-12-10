<?php
class GameController {
    public function getQuestions() {
        $questions = [
            ["type" => "truth", "text" => "What is one thing you've never told your parents?"],
            ["type" => "comfort", "text" => "What is your favorite way to be comforted when you're sad?"],
            ["type" => "truth", "text" => "When was the last time you cried and why?"],
            ["type" => "comfort", "text" => "Describe your perfect Sunday morning."],
            ["type" => "truth", "text" => "What is your biggest fear in a relationship?"]
        ];
        echo json_encode($questions);
    }
}
?>
