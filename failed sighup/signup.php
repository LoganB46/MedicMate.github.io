<!DOCTYPE html>
 <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width-device-width, initial-scare=1">
        <title>Signup</title>
        <link href="css/bootstrap.min.css" rel="stylesheet"/>
        <script src="js/bootstrap.bundle.js"></script>
    </head>
    <body> 

        <h3>Signup</h3>

        <form action="includes/formhandler.inc.php" method="post">
            <input type="text" name="name" placeholder="Full Name">
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="pwd" placeholder="Password">
            <input type="text" name="email" placeholder="E-mail">
            <button>Signup</button>
        </form>
    </body>
</html>