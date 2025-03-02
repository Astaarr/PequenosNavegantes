<?php
session_start();

// Habilitar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configurar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_padre'])) {
    die(json_encode(["success" => false, "message" => "Usuario no autenticado"]));
}

// Obtener los datos enviados por POST
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_inscripcion'])) {
    die(json_encode(["success" => false, "message" => "ID de inscripción no proporcionado"]));
}

$id_inscripcion = $data['id_inscripcion'];

// Consulta para obtener los datos de la inscripción y el hijo relacionado
$sql = "SELECT 
            i.id_inscripcion, i.estado_pago, i.precio, i.plan, i.fecha_json, i.numero_dias,
            h.nombre AS nombre_hijo, h.apellidos AS apellidos_hijo, 
            h.medicacion, h.alergias, h.datos_adicionales,
            ta.nombre AS nombre_autorizado, ta.DNI AS dni_autorizado, ta.telefono_autorizado
        FROM inscripcion i
        JOIN hijo h ON i.id_hijo = h.id_hijo
        LEFT JOIN tutor_adicional ta ON ta.id_padre = h.id_padre
        WHERE i.id_inscripcion = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_inscripcion);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Decodificar fechas en JSON
    $row['fecha_json'] = json_decode($row['fecha_json'], true);

    echo json_encode(["success" => true, "inscripcion" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontró la inscripción"]);
}

$stmt->close();
$conexion->close();
?>
