<?php
// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de CORS
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Incluir archivos necesarios
include '../conecta.php';
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Obtener datos del frontend
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que los datos se recibieron correctamente
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Verifica que la contraseña no esté vacía
if (empty($password)) {
    echo json_encode(["success" => false, "message" => "La contraseña no puede estar vacía."]);
    exit;
}

// Encriptar la contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario en la base de datos
$sql = "INSERT INTO padre (nombre, email, password) VALUES (?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sss", $nombre, $email, $hashedPassword);

if ($stmt->execute()) {
    // **✅ Enviar correo de bienvenida**
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USERNAME']; 
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = $_ENV['SMTP_SECURE'];
        $mail->Port = $_ENV['SMTP_PORT'];

        // Configuración del correo
        $mail->CharSet = 'UTF-8';
        $mail->setFrom('soportepequenosnavegantes@gmail.com', 'Pequeños Navegantes');
        $mail->addAddress($email, $nombre);
        $mail->Subject = '¡Bienvenido a Pequeños Navegantes!';
        $mail->isHTML(true);

        // Construcción del correo en HTML
        $mail->Body = "
            <html>
            <head>
                <meta charset='UTF-8'>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; }
                    .container { padding: 20px; background: #f4f4f4; border-radius: 15px; width: 50%; margin: auto; }
                    .titulo { font-size: 22px; font-weight: bold; color: #0184DC; }
                    .texto { font-size: 16px; color: #333; margin-top: 10px; }
                    .button { background-color: #0184DC; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 15px; display: inline-block; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 class='titulo'>¡Hola, $nombre!</h2>
                    <p class='texto'>Te damos la bienvenida a <strong>Pequeños Navegantes</strong>.</p>
                    <p class='texto'>Ahora puedes acceder a tu cuenta y disfrutar de todas nuestras actividades.</p>
                    <a href='https://localhost/PequenosNavegantes/app/frontend/login/login.html' class='button'>Acceder a mi cuenta</a>
                </div>
            </body>
            </html>";

        // Enviar el correo
        $mail->send();
        echo json_encode(["success" => true, "message" => "Registro exitoso. Correo enviado"]);
    } catch (Exception $e) {
        echo json_encode(["success" => true, "message" => "Registro exitoso, pero error al enviar el correo: " . $mail->ErrorInfo]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar usuario."]);
}

$stmt->close();
$conexion->close();
?>
