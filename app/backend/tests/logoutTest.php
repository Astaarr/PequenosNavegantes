<?php

use PHPUnit\Framework\TestCase;

class LogoutTest extends TestCase {
    protected $conexion;

    // Configuración inicial para establecer la conexión a la base de datos
    protected function setUp(): void
    {
        $this->conexion = new mysqli('host', 'usuario', 'contraseña', 'base_de_datos');
        $this->assertFalse($this->conexion->connect_error, "Debe conectar correctamente a la base de datos");
    }

    // Prueba para cerrar sesión exitosamente
    public function testCerrarSesionExitoso()
    {
        // Simula una sesión y una cookie
        $_SESSION['id_padre'] = 1;
        $_COOKIE['token_login'] = 'dummy_token';
        
        // Inserta un token de prueba en la base de datos
        $token = 'dummy_token';
        $sql = "UPDATE padre SET token_login = ? WHERE id_padre = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("si", $token, $_SESSION['id_padre']);
        $stmt->execute();
        
        // Llama al método logout y captura la salida
        $output = $this->logout();
        
        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => true, "message" => "Sesión cerrada correctamente"]),
            $output
        );
        
        // Verifica que el token se haya eliminado de la base de datos
        $sql = "SELECT token_login FROM padre WHERE id_padre = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $_SESSION['id_padre']);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $this->assertNull($row['token_login'], "El token debe haberse eliminado de la base de datos");
    }

    // Método privado para simular el comportamiento del script de cierre de sesión
    private function logout()
    {
        ob_start();
        
        // Incluye el script real de cierre de sesión
        require_once '../login/logout.php';
        
        // Captura y retorna la salida del script
        $output = ob_get_clean();
        return $output;
    }

    // Cierra la conexión a la base de datos
    protected function tearDown(): void
    {
        $this->conexion->close();
    }
}
?>
