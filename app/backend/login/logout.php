<?php
session_start();
session_destroy();

if (isset($_COOKIE[''])){
    setcookie("token_login", "", time() - 3600, "/", "", true, true);
    echo json_encode(["success" => true, "message" => "Sesión cerrada"]);
} else {
    echo json_encode(["success" => false, "message" => "No hay sesión activa"]);
}

?>