<?php
session_start();

// Habilitar errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

// Obtener datos del POST
$data = json_decode(file_get_contents("php://input"), true);
$id_solicitud = $data['id_solicitud'] ?? null;
$dni = $data['dni'] ?? null;
$password = $data['password'] ?? null;

// Verificar que los datos están completos
if (!$id_solicitud || !$dni || !$password) {
    die(json_encode(["success" => false, "message" => "Faltan datos obligatorios"]));
}

// Hash de la contraseña
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// Obtener los datos de la solicitud de la tabla solicitud_monitor
$sql = "SELECT nombre, apellidos, email, telefono, curriculum FROM solicitud_monitor WHERE id_solicitud = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_solicitud);
$stmt->execute();
$result = $stmt->get_result();
$solicitud = $result->fetch_assoc();

// Verificar si existe la solicitud
if (!$solicitud) {
    die(json_encode(["success" => false, "message" => "La solicitud no existe."]));
}

// Insertar los datos en la tabla monitor
$sql_insert = "INSERT INTO monitor (DNI, nombre, apellidos, password, email, telefono, curriculum) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt_insert = $conexion->prepare($sql_insert);
$stmt_insert->bind_param("sssssss", $dni, $solicitud['nombre'], $solicitud['apellidos'], $hashed_password, $solicitud['email'], $solicitud['telefono'], $solicitud['curriculum']);

if ($stmt_insert->execute()) {
    // Borrar la solicitud de la tabla solicitud_monitor
    $sql_delete = "DELETE FROM solicitud_monitor WHERE id_solicitud = ?";
    $stmt_delete = $conexion->prepare($sql_delete);
    $stmt_delete->bind_param("i", $id_solicitud);
    $stmt_delete->execute();

    echo json_encode(["success" => true, "message" => "Monitor añadido con éxito"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al añadir el monitor"]);
}

// Cerrar conexiones
$stmt->close();
$stmt_insert->close();
$stmt_delete->close();
$conexion->close();
?>
