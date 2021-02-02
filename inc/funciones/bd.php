<?php

define('DB_USUARIO', 'root');
define('DB_PASSWORD', 'tutorial.2020');
define('DB_HOST', 'localhost:23306');
define('DB_NAME', 'agendaphp');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NAME);

//echo $conn->ping();



?>