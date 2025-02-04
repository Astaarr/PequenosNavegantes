<?php
session_start();
include '../conecta.php'; // Conexión a la base de datos

// Obtener los datos enviados desde Axios
$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? '';

// Verificar si el token existe en la base de datos
$sql = "SELECT id_padre FROM padre WHERE token_login = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $_SESSION['id_padre'] = $row['id_padre']; // Restaurar la sesión
    echo json_encode(["success" => true, "message" => "Token válido"]);
} else {
    echo json_encode(["success" => false, "message" => "Token inválido"]);
}
?>
