<?php
session_start();
session_destroy(); // Cierra la sesión

if (isset($_COOKIE['token_login'])) {
    setcookie("token_login", "", time() - 3600, "/", "", false, true); // Borra la cookie
}

// También borra el token en la base de datos
include '../conecta.php';
$sql = "UPDATE padre SET token_login = NULL WHERE token_login = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $_COOKIE['token_login']);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente"]);
?>
