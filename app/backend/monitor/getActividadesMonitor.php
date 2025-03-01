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

// Obtener la fecha desde la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);
$fecha = isset($data['fecha']) ? $conexion->real_escape_string($data['fecha']) : null;

if (!$fecha) {
    echo json_encode(["success" => false, "message" => "Fecha no proporcionada"]);
    exit;
}

// Ver si el monitor tiene grupos asignados
$sqlGrupos = "SELECT id_grupo FROM grupo WHERE id_monitor = ?";
$stmtGrupos = $conexion->prepare($sqlGrupos);
$stmtGrupos->bind_param("i", $id_monitor);
$stmtGrupos->execute();
$resultGrupos = $stmtGrupos->get_result();

$grupos = [];
while ($row = $resultGrupos->fetch_assoc()) {
    $grupos[] = $row['id_grupo'];
}
$stmtGrupos->close();

if (empty($grupos)) {
    echo json_encode(["success" => true, "message" => "El monitor no tiene grupos asignados", "actividades" => []]);
    exit;
}

// Buscar actividades para esos grupos en la fecha seleccionada
$actividades = [];
foreach ($grupos as $id_grupo) {
    $sqlActividades = "SELECT id_programacion, fecha, hora_inicio, duracion, lugar, id_actividad, id_grupo 
                       FROM programacion_actividad WHERE fecha = ? AND id_grupo = ?";
    $stmtActividades = $conexion->prepare($sqlActividades);
    $stmtActividades->bind_param("si", $fecha, $id_grupo);
    $stmtActividades->execute();
    $resultActividades = $stmtActividades->get_result();

    while ($row = $resultActividades->fetch_assoc()) {
        // Obtener el nombre de la actividad
        $sqlNombreActividad = "SELECT nombre FROM actividad WHERE id_actividad = ?";
        $stmtNombreActividad = $conexion->prepare($sqlNombreActividad);
        $stmtNombreActividad->bind_param("i", $row['id_actividad']);
        $stmtNombreActividad->execute();
        $resultNombreActividad = $stmtNombreActividad->get_result();
        $actividad = $resultNombreActividad->fetch_assoc();
        $stmtNombreActividad->close();

        // Agregar actividad a la respuesta final
        $actividades[] = [
            "id_programacion" => $row['id_programacion'],
            "fecha" => $row['fecha'],
            "hora_inicio" => $row['hora_inicio'],
            "duracion" => $row['duracion'],
            "lugar" => $row['lugar'],
            "id_actividad" => $row['id_actividad'],
            "nombre_actividad" => $actividad['nombre'] ?? "Desconocida"
        ];
    }
    $stmtActividades->close();
}

// Si no hay actividades, devolver mensaje claro
if (empty($actividades)) {
    echo json_encode(["success" => true, "message" => "No hay actividades para la fecha seleccionada", "actividades" => []]);
} else {
    echo json_encode(["success" => true, "actividades" => $actividades]);
}

$conexion->close();
?>
