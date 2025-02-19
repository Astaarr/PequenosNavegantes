<?php
// Habilitar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';

    // Manejo del archivo
    if (isset($_FILES['curriculum']) && $_FILES['curriculum']['error'] === UPLOAD_ERR_OK) {
        $directorioDestino = '../uploads/';
        if (!is_dir($directorioDestino)) {
            mkdir($directorioDestino, 0777, true);
        }

        $nombreArchivo = uniqid() . "_" . basename($_FILES['curriculum']['name']);
        $rutaCompleta = $directorioDestino . $nombreArchivo;

        if (move_uploaded_file($_FILES['curriculum']['tmp_name'], $rutaCompleta)) {
            $curriculum = $rutaCompleta; // Guardar la ruta en la BD
        } else {
            echo json_encode(["success" => false, "message" => "Error al subir el archivo."]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "No se ha subido ningún archivo."]);
        exit;
    }

    // Guardar datos en la base de datos
    $sql = "INSERT INTO solicitud_monitor (nombre, apellidos, email, telefono, curriculum) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sssss", $nombre, $apellidos, $email, $telefono, $curriculum);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Solicitud exitosa"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error en la solicitud."]);
    }

    $stmt->close();
    $conexion->close();
}

?>