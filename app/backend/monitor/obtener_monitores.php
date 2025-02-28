<?php
session_start();

// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Incluir conexión
include '../conecta.php';

// Verificar conexión
if (!$conexion) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit;
}


// Consulta para obtener monitores
$sql = "SELECT id_solicitud, nombre, apellidos, email, telefono, curriculum FROM solicitud_monitor";
$resultado = $conexion->query($sql);

if (!$resultado) {
    echo json_encode(["success" => false, "message" => "Error en la consulta SQL: " . $conexion->error]);
    exit;
}

$monitores = [];

while ($fila = $resultado->fetch_assoc()) {
    $monitores[] = $fila;
}

// Retornar datos en JSON
echo json_encode(["success" => true, "monitores" => $monitores]);

$conexion->close();
?>