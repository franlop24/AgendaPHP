<?php

define('DB_USUARIO', 'root');
define('DB_PASSWORD', 'example');
define('DB_HOST', 'db');
define('DB_NAME', 'agendaphp');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NAME);

//echo $conn->ping();

?>