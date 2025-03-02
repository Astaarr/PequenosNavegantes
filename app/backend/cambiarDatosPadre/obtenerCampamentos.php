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

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_padre'])) {
    die(json_encode(["success" => false, "message" => "Usuario no autenticado"]));
}

$id_padre = $_SESSION['id_padre'];

// Obtener los hijos del padre con nombre y apellidos
$sql = "SELECT id_hijo, nombre, apellidos FROM hijo WHERE id_padre = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_padre);
$stmt->execute();
$result = $stmt->get_result();

$campamentos = [];
while ($row = $result->fetch_assoc()) {
    $id_hijo = $row['id_hijo'];
    $nombre_hijo = $row['nombre'];
    $apellidos_hijo = $row['apellidos'];

    // Obtener la fecha_json y la id_inscripcion de la inscripción
    $sql2 = "SELECT id_inscripcion, fecha_json FROM inscripcion WHERE id_hijo = ?";
    $stmt2 = $conexion->prepare($sql2);
    $stmt2->bind_param("i", $id_hijo);
    $stmt2->execute();
    $result2 = $stmt2->get_result();

    while ($row2 = $result2->fetch_assoc()) {
        $fecha_json = json_decode($row2['fecha_json'], true);
        
        // Tomar la primera fecha si es un array válido
        $fecha_mostrar = is_array($fecha_json) && count($fecha_json) > 0 ? $fecha_json[0] : "Fecha no disponible";

        $campamentos[] = [
            "id_inscripcion" => $row2['id_inscripcion'], 
            "nombre_hijo" => $nombre_hijo,
            "apellidos_hijo" => $apellidos_hijo,
            "fecha_json" => $fecha_mostrar
        ];
    }
}

echo json_encode(["success" => true, "campamentos" => $campamentos]);

$stmt->close();
$conexion->close();
?>
