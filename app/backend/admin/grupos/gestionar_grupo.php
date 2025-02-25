<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../../conecta.php';

if (!$conexion) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

$data = json_decode(file_get_contents("php://input"), true);
$accion = $data['accion'] ?? null; // 'guardar_grupo', 'eliminar_monitor', 'eliminar_nino', 'agregar_nino'

if ($accion === 'guardar_grupo') {
    // Guardar o editar grupo
    $idGrupo = $data['id_grupo'] ?? null;
    $nombre = $data['nombre'];
    $idMonitor = $data['id_monitor'];
    $ninos = $data['ninos'] ?? []; // Obtener el array de niños

    if ($idGrupo) {
        // Editar grupo existente
        $sql = "UPDATE grupo SET nombre = ?, id_monitor = ? WHERE id_grupo = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("sii", $nombre, $idMonitor, $idGrupo);
    } else {
        // Agregar nuevo grupo
        $sql = "INSERT INTO grupo (nombre, id_monitor) VALUES (?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("si", $nombre, $idMonitor);
    }

    if ($stmt->execute()) {
        if (!$idGrupo) {
            // Obtener el ID del grupo recién creado
            $idGrupo = $stmt->insert_id;
        }

        // Guardar niños si existen
        foreach ($ninos as $nino) {
            $idNino = $nino['id_hijo'];
            $sqlNino = "UPDATE hijo SET id_grupo = ? WHERE id_hijo = ?";
            $stmtNino = $conexion->prepare($sqlNino);
            $stmtNino->bind_param("ii", $idGrupo, $idNino);
            $stmtNino->execute();
            $stmtNino->close();
        }

        echo json_encode(["success" => true, "id_grupo" => $idGrupo]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar el grupo."]);
    }

    $stmt->close();
} elseif ($accion === 'eliminar_monitor') {
    // Eliminar monitor del grupo
    $idMonitor = $data['id'];

    $sql = "UPDATE grupo SET id_monitor = NULL WHERE id_monitor = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idMonitor);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar monitor del grupo."]);
    }

    $stmt->close();
} elseif ($accion === 'eliminar_nino') {
    // Eliminar niño del grupo
    $idNino = $data['id'];

    $sql = "UPDATE hijo SET id_grupo = NULL WHERE id_hijo = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idNino);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar niño del grupo."]);
    }

    $stmt->close();

} elseif ($accion === 'agregar_nino') {
    // Agregar niño al grupo
    $idNino = $data['id_hijo'];
    $idGrupo = $data['id_grupo'];

    if (!$idNino || !$idGrupo) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit;
    }

    // Verificar si el niño ya está en otro grupo
    $sql = "SELECT id_grupo FROM hijo WHERE id_hijo = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idNino);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $fila = $resultado->fetch_assoc();

    if ($fila && $fila['id_grupo'] !== null) {
        echo json_encode(["success" => false, "message" => "El niño ya está en otro grupo."]);
        exit;
    }

    // Actualizar el id_grupo del niño
    $sql = "UPDATE hijo SET id_grupo = ? WHERE id_hijo = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ii", $idGrupo, $idNino);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al agregar niño al grupo."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Acción no válida."]);
}


$conexion->close();
?>