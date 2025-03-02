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

// Obtener el id_hijo antes de borrar la inscripción
$sql_hijo = "SELECT id_hijo FROM inscripcion WHERE id_inscripcion = ?";
$stmt_hijo = $conexion->prepare($sql_hijo);
$stmt_hijo->bind_param("i", $id_inscripcion);
$stmt_hijo->execute();
$result_hijo = $stmt_hijo->get_result();
$row_hijo = $result_hijo->fetch_assoc();
$id_hijo = $row_hijo['id_hijo'];
$stmt_hijo->close();

// Eliminar la inscripción
$sql_delete_inscripcion = "DELETE FROM inscripcion WHERE id_inscripcion = ?";
$stmt_delete = $conexion->prepare($sql_delete_inscripcion);
$stmt_delete->bind_param("i", $id_inscripcion);

if ($stmt_delete->execute()) {
    $stmt_delete->close();

    // Verificar si el hijo tiene más inscripciones
    $sql_check = "SELECT COUNT(*) AS total FROM inscripcion WHERE id_hijo = ?";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bind_param("i", $id_hijo);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    $row_check = $result_check->fetch_assoc();
    $stmt_check->close();

    // Si el hijo no tiene más inscripciones, lo eliminamos
    if ($row_check['total'] == 0) {
        $sql_delete_hijo = "DELETE FROM hijo WHERE id_hijo = ?";
        $stmt_delete_hijo = $conexion->prepare($sql_delete_hijo);
        $stmt_delete_hijo->bind_param("i", $id_hijo);
        $stmt_delete_hijo->execute();
        $stmt_delete_hijo->close();
    }

    echo json_encode(["success" => true, "message" => "Inscripción y, si aplicaba, hijo eliminado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar la inscripción"]);
}

$conexion->close();
?>
