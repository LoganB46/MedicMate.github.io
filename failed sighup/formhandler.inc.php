<?php

if ($_server["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];
    $email = $_POST["email"];

    try {
        require_once "dbh.inc.php";

        $query ="INSERT INTO users (name, username, pwd, email) VALUES
        (?, ?, ?, ?);";

        $stmt = $pdo->prepare($query);

        $stmt->execute([$name, $username, $pwd, $email]);

        $pdo = null;
        $stmt = null;

        header("Location: ../login.php");
        die();
    } catch (PDOException $e) {
        die("Query Failed: " . $e->getMessage());
    }
}
else{
    header("Location: ../login.php");
}
