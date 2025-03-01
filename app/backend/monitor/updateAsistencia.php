<?php
include '../conecta.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id_hijo'], $data['id_programacion'], $data['asistio'])) {
    $sql = "INSERT INTO asistencia (id_hijo, id_programacion, asistio) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE asistio = ?";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iiii", 
        $data['id_hijo'], 
        $data['id_programacion'], 
        $data['asistio'], 
        $data['asistio']
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Error al actualizar asistencia"]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}

$conexion->close();
?>
