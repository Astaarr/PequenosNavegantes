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

// Obtener los datos enviados en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validar que los datos se hayan recibido
if (!$data) {
    die(json_encode(["success" => false, "message" => "No se recibieron datos"]));
}

// Construir la consulta SQL dinámicamente
$campos = [];
$valores = [];

if (isset($data['nombre']) && !empty($data['nombre'])) {
    $campos[] = "nombre = ?";
    $valores[] = $data['nombre'];
}

if (isset($data['dni']) && !empty($data['dni'])) {
    $campos[] = "dni = ?";
    $valores[] = $data['dni'];
}

if (isset($data['telefono']) && !empty($data['telefono'])) {
    $campos[] = "telefono = ?";
    $valores[] = $data['telefono'];
}

if (isset($data['telefono_adicional']) && !empty($data['telefono_adicional'])) {
    $campos[] = "telefono_adicional = ?";
    $valores[] = $data['telefono_adicional'];
}

// Verificar si hay campos para actualizar
if (empty($campos)) {
    die(json_encode(["success" => false, "message" => "No hay campos para actualizar"]));
}

// Construir la consulta SQL
$sql = "UPDATE padre SET " . implode(", ", $campos) . " WHERE id_padre = ?";
$valores[] = $id_padre;

$stmt = $conexion->prepare($sql);
$stmt->bind_param(str_repeat("s", count($campos)) . "i", ...$valores);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Datos actualizados correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar los datos"]);
}

$stmt->close();
$conexion->close();
?>
