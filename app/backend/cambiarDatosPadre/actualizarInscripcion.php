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

// Obtener los datos enviados en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

// Verificar que se envió el ID de inscripción
if (!isset($data['id_inscripcion'])) {
    die(json_encode(["success" => false, "message" => "ID de inscripción no proporcionado"]));
}

$id_inscripcion = $data['id_inscripcion'];
$alergias = $data['alergias'] ?? "";
$medicacion = $data['medicacion'] ?? "";
$datos_adicionales = $data['datos_adicionales'] ?? "";
$nombre_autorizado = $data['nombre_autorizado'] ?? "";
$dni_autorizado = $data['dni_autorizado'] ?? "";
$tel_autorizado = $data['tel_autorizado'] ?? "";

// Actualizar la información en la tabla `hijo`
$sqlHijo = "UPDATE hijo 
            JOIN inscripcion ON hijo.id_hijo = inscripcion.id_hijo 
            SET hijo.alergias = ?, hijo.medicacion = ?, hijo.datos_adicionales = ?
            WHERE inscripcion.id_inscripcion = ?";

$stmtHijo = $conexion->prepare($sqlHijo);
$stmtHijo->bind_param("sssi", $alergias, $medicacion, $datos_adicionales, $id_inscripcion);
$hijoActualizado = $stmtHijo->execute();
$stmtHijo->close();

// Verificar si hay datos de recogida antes de actualizarlos
if (!empty($nombre_autorizado) || !empty($dni_autorizado) || !empty($tel_autorizado)) {
    // Intentar actualizar si el tutor ya existe
    $sqlUpdateTutor = "UPDATE tutor_adicional 
                        JOIN hijo ON tutor_adicional.id_padre = hijo.id_padre 
                        JOIN inscripcion ON hijo.id_hijo = inscripcion.id_hijo 
                        SET tutor_adicional.nombre = ?, tutor_adicional.DNI = ?, tutor_adicional.telefono_autorizado = ?
                        WHERE inscripcion.id_inscripcion = ?";

    $stmtTutor = $conexion->prepare($sqlUpdateTutor);
    $stmtTutor->bind_param("sssi", $nombre_autorizado, $dni_autorizado, $tel_autorizado, $id_inscripcion);
    $tutorActualizado = $stmtTutor->execute();
    $stmtTutor->close();
} else {
    $tutorActualizado = true; // Si no hay datos, consideramos que no hubo cambios
}

// Si todas las actualizaciones fueron exitosas, enviamos una respuesta de éxito
if ($hijoActualizado && $tutorActualizado) {
    echo json_encode(["success" => true, "message" => "Inscripción actualizada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar la inscripción"]);
}

$conexion->close();
?>
