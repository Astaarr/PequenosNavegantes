<?php
session_start();

// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Incluir conexión
include '../../conecta.php';

// Verificar conexión
if (!$conexion) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

// Comprobar si la sesión está activa
if (!isset($_SESSION)) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa."]);
    exit;
}

// Consulta para obtener grupos con el nombre del monitor
$sql = "SELECT g.id_grupo, g.nombre, m.nombre AS nombre_monitor 
        FROM grupo g 
        JOIN monitor m ON g.id_monitor = m.id_monitor";
$resultado = $conexion->query($sql);

if (!$resultado) {
    echo json_encode(["success" => false, "message" => "Error en la consulta SQL: " . $conexion->error]);
    exit;
}

$grupos = [];

while ($fila = $resultado->fetch_assoc()) {
    $grupos[] = $fila;
}

// Retornar datos en JSON
echo json_encode(["success" => true, "grupos" => $grupos]);

$conexion->close();
?>