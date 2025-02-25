<?php
session_start();

// Habilitar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_padre'])) {
    die(json_encode(["success" => false, "message" => "Usuario no autenticado"]));
}

$id_padre = $_SESSION['id_padre'];

// Obtener los datos enviados
$data = json_decode(file_get_contents("php://input"), true);

// Validar que se recibieron todos los campos
if (!isset($data['passwordOld']) || !isset($data['password'])) {
    die(json_encode(["success" => false, "message" => "Faltan campos obligatorios"]));
}

$passwordAntigua = $data['passwordOld'];
$passwordNueva = $data['password'];

// Obtener la contraseña actual del usuario
$sql = "SELECT password FROM padre WHERE id_padre = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_padre);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    die(json_encode(["success" => false, "message" => "Usuario no encontrado"]));
}

$passwordHash = $row['password'];

// Verificar que la contraseña actual sea correcta
if (!password_verify($passwordAntigua, $passwordHash)) {
    die(json_encode(["success" => false, "message" => "La contraseña actual es incorrecta"]));
}

// Actualizar la contraseña en la base de datos
$passwordHashNueva = password_hash($passwordNueva, PASSWORD_BCRYPT);
$sql = "UPDATE padre SET password = ? WHERE id_padre = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("si", $passwordHashNueva, $id_padre);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Contraseña actualizada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar la contraseña"]);
}

$stmt->close();
$conexion->close();
?>
