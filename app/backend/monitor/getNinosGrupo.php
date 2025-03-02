<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conecta.php';

// Verificar si hay sesión activa
if (!isset($_SESSION['id_monitor'])) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa"]);
    exit;
}

$id_monitor = $_SESSION['id_monitor']; // Se obtiene desde la sesión

// Obtener la fecha más reciente de asistencia programada
$sqlFecha = "SELECT fecha FROM programacion_actividad 
             WHERE id_grupo IN (SELECT id_grupo FROM grupo WHERE id_monitor = ?)
             ORDER BY fecha DESC LIMIT 1";

$stmtFecha = $conexion->prepare($sqlFecha);
$stmtFecha->bind_param("i", $id_monitor);
$stmtFecha->execute();
$resultFecha = $stmtFecha->get_result();
$fecha = $resultFecha->fetch_assoc()['fecha'] ?? null;
$stmtFecha->close();

if (!$fecha) {
    echo json_encode(["success" => false, "message" => "No hay actividades registradas para este monitor"]);
    exit;
}

// Obtener el ID del grupo y la programación más reciente de este monitor
$sqlInfo = "SELECT pa.id_programacion, pa.hora_inicio, a.nombre AS actividad, g.nombre AS nombre_grupo
            FROM programacion_actividad pa
            JOIN actividad a ON pa.id_actividad = a.id_actividad  
            JOIN grupo g ON pa.id_grupo = g.id_grupo
            WHERE g.id_monitor = ? AND pa.fecha = ?
            ORDER BY pa.hora_inicio ASC LIMIT 1";


$stmtInfo = $conexion->prepare($sqlInfo);
$stmtInfo->bind_param("is", $id_monitor, $fecha);
$stmtInfo->execute();
$resultInfo = $stmtInfo->get_result();
$info = $resultInfo->fetch_assoc();
$stmtInfo->close();

if (!$info) {
    echo json_encode(["success" => false, "message" => "No se encontró programación para esta fecha"]);
    exit;
}

$id_programacion = $info['id_programacion'];
$hora_inicio = $info['hora_inicio'];
$nombre_grupo = $info['nombre_grupo'];

// Obtener la lista de niños del grupo
$sqlNinos = "SELECT h.id_hijo, h.nombre, h.apellidos, 
             CASE WHEN a.id_hijo IS NOT NULL THEN 1 ELSE 0 END AS asistio
             FROM hijo h
             LEFT JOIN asistencia a ON h.id_hijo = a.id_hijo AND a.id_programacion = ?
             WHERE h.id_grupo = (SELECT id_grupo FROM programacion_actividad WHERE id_programacion = ?)";

$stmtNinos = $conexion->prepare($sqlNinos);
$stmtNinos->bind_param("ii", $id_programacion, $id_programacion);
$stmtNinos->execute();
$resultNinos = $stmtNinos->get_result();

$ninos = [];
while ($row = $resultNinos->fetch_assoc()) {
    $ninos[] = $row;
}
$stmtNinos->close();

// Responder con los datos
echo json_encode([
    "success" => true,
    "fecha" => $fecha,
    "hora" => $hora_inicio,
    "actividad" => $info['actividad'],
    "nombre_grupo" => $nombre_grupo,
    "ninos" => $ninos
]);


$conexion->close();
?>
