<?php
session_start();

// Habilitar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *"); // Permite peticiones desde cualquier dominio
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permite POST y la pre-flight request (OPTIONS)
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Permite enviar datos JSON y tokens

include '../conecta.php';

if (!isset($_SESSION['id_padre'])) {
    die(json_encode(["success" => false, "message" => "Usuario no autenticado"]));
}

$datosReserva = json_decode(file_get_contents('php://input'), true);

$id_padre = $_SESSION['id_padre'];
$tarifa = $datosReserva['tarifa'] ?? '';
$tutor = $datosReserva['tutor'] ?? '';
$hijo = $datosReserva['hijo'] ?? '';


try {
    if (!empty($tutor['dniPadre']) || !empty($tutor['telPadre']) || !empty($tutor['telPadreAdicional'])) {
        $sql1 = "UPDATE padre SET 
                DNI = COALESCE(NULLIF (?, ''), DNI),
                telefono = COALESCE(NULLIF (?, ''), telefono),
                telefono_adicional = COALESCE(NULLIF (?, ''), telefono_adicional)
            WHERE id_padre = ?";
        $stmt1 = $conexion->prepare($sql1);
        $stmt1->bind_param("sssi", $tutor['dniPadre'], $tutor['telPadre'], $tutor['telPadreAdicional'], $id_padre);
        $stmt1->execute();
    }
    if (!empty($tutor['dniAutorizado']) || !empty($tutor['telAutorizado']) || !empty($tutor['nombreAutorizado'])){
        $sql2 = "INSERT INTO tutor_adicional (DNI, nombre, telefono_autorizado, id_padre) VALUES (?, ?, ?, ?)";
        $stmt2 = $conexion->prepare($sql2);
        $stmt2->bind_param("sssi", $tutor["dniAutorizado"], $tutor["nombreAutorizado"], $tutor["telAutorizado"], $id_padre);
        $stmt2->execute();
    }
    if (!empty($hijo['nombreHijo']) || !empty($hijo['apellidosHijo']) || !empty($hijo['nacimientoHijo']) || !empty($hijo['medicacionActual']) || !empty($hijo['alergiaHijo']) || !empty($hijo['infoAdicionalHijo'])){
        $sql3 = "INSERT INTO hijo (nombre, apellidos, fecha_nacimiento, medicacion, alergias, datos_adicionales, id_padre) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt3 = $conexion ->prepare($sql3);
        $stmt3->bind_param("ssssssi", $hijo["nombreHijo"], $hijo["apellidosHijo"], $hijo["nacimientoHijo"], $hijo["medicacionActual"], $hijo["alergiaHijo"], $hijo["infoAdicionalHijo"], $id_padre);
        $stmt3->execute();
        // Obtener el ID del hijo insertado
        $id_hijo = $conexion->insert_id;
    }
    if(!empty($tarifa['diasSeleccionados']) || !empty($tarifa['nDias']) || !empty($tarifa['precioTotal']) || !empty($tarifa['planSeleccionado'])){
        $fechas_json = json_encode($tarifa['diasSeleccionados']);

        $sql4 = 'INSERT INTO inscripcion (fecha_inscripcion, numero_dias, precio, plan, id_hijo, estado_pago, fecha_json) 
        VALUES (CURDATE(), ?, ?, ?, ?, "Pendiente", ?)';
        $stmt4 = $conexion -> prepare($sql4);
        $stmt4->bind_param('idsis', $tarifa['nDias'], $tarifa['precioTotal'], $tarifa['planSeleccionado'], $id_hijo, $fechas_json);
        $stmt4->execute();
    }
    echo json_encode(["success" => true, "message" => "Inscripción completada con éxito"]);
} catch (Exception $e) {
    $conexion->rollback();
    echo json_encode(["success" => false, "message" => "Error en la actualización", "error" => $e->getMessage()]);
}

// // Verificar si `UPDATE` afectó filas
// if ($stmt->affected_rows > 0) {
//     echo json_encode(["success" => true, "message" => "Datos del padre actualizados correctamente"]);
// } else {
//     die(json_encode(["success" => false, "message" => "No se realizaron cambios en la base de datos", "id_padre" => $id_padre, "dniPadre" => $tutor['dniPadre'], "telPadre" => $tutor['telPadre']]));
// }

// $response = [
//     "success" => true,
//     "message" => "Datos recibidos correctamente",
//     "datos" => [
//         "tarifa" => $tarifa,
//         "tutor" => $tutor,
//         "hijo" => $hijo
//     ]
// ];

// echo json_encode($response);


// if (isset($_SESSION['id_padre'])) {
//     echo "Sesión iniciada. ID del padre: " . $_SESSION['id_padre'];
// } else {
//     echo "No hay sesión activa.";
// }

?>