<?php
session_start();

require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;


// Configurar la respuesta como JSON
header("Content-Type: application/json");

// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

// Obtener JSON de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Error: No se recibió ningún JSON"]);
    exit;
}

// Verificar que el email está en el JSON
$email = isset($data['emailRecuperacion']) 
    ? (is_array($data['emailRecuperacion']) ? $data['emailRecuperacion'][0] : $data['emailRecuperacion'])
    : '';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Error: Email inválido"]);
    exit;
}

// Comprobar si el correo existe en la base de datos
$sql = "SELECT id_padre, nombre FROM padre WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    echo json_encode(["success" => false, "message" => "Error: Correo no registrado"]);
    exit;
}

$nombre = $row["nombre"];

// Generar código y token de restablecimiento
$codigo_restablecer = bin2hex(random_bytes(4));
$token_restablecer = bin2hex(random_bytes(40));

// Guardar código y token en la base de datos
$sql = "UPDATE padre SET codigo_restablecer = ?, token_restablecer = ? WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sss", $codigo_restablecer, $token_restablecer, $email);
$stmt->execute();

try {
    // Configuración del servidor SMTP de Gmail
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USERNAME']; 
    $mail->Password = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = $_ENV['SMTP_SECURE'];
    $mail->Port = $_ENV['SMTP_PORT'];

    // Configuración del correo
    $mail->setFrom('soportepequenosnavegantes@gmail.com', 'Pequeños Navegantes');
    $mail->addAddress($email, $nombre);
    $mail->Subject = 'Código de restablecimiento de contraseña';
    $mail->isHTML(true);

    // Construcción del correo en HTML
    $mail->Body = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                .container { padding: 20px; background: #f4f4f4; border-radius: 5px; width: 50%; margin: auto; }
                .codigo { font-size: 20px; font-weight: bold; color: #007BFF; }
                .button { background: #007BFF; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>Hola, $nombre</h2>
                <p>Has solicitado restablecer tu contraseña en <strong>Pequeños Navegantes</strong>.</p>
                <p>Tu código de verificación es:</p>
                <h2 class='codigo'>$codigo_restablecer</h2>
                <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                <a href='https://tu-dominio.com/restablecer.php?token=$token_restablecer' class='button'>Restablecer contraseña</a>
                <p>Este enlace expirará en 30 minutos.</p>
            </div>
        </body>
        </html>";

    // Enviar el correo
    $mail->send();
    echo json_encode(["success" => true, "message" => "Correo enviado"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error al enviar el correo: " . $mail->ErrorInfo]);
}
?>
