<?php
session_start();
header('Content-Type: application/json');

// Destruye la sesión
session_destroy();

// Borra la cookie si existe
if (isset($_COOKIE['token_login'])) {
    setcookie("token_login", "", time() - 3600, "/", "", false, true);
}

// Conecta a la base de datos y borra el token
include '../conecta.php';

if (isset($_COOKIE['token_login'])) {
    $sql = "UPDATE padre SET token_login = NULL WHERE token_login = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $_COOKIE['token_login']);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente"]);
?>
