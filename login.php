<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $mysqli = require __DIR__ . "/database.php";


    $sql = sprintf("SELECT * FROM company
            WHERE license = '%s'",
            $mysqli->real_escape_string($_POST["license"]));

            $mysqli->query($sql);

            $company = $result->fetch_assoc();

            var_dump($company);
            exit;

}

?>
<!DOCTYPE html>
<html>
    <head>
        <tittle>Login</tittle>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
    </head>
    <body>

        <h1>Login</h1>

         <form method="post">
            <lable for="license">License Key</lable>
            <input type="text" name="license" id="licesne">

            <button>Log in</button>
        </form>

    </body>
</html>