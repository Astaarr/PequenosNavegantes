<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../cambiarDatosPadre/cambiarPasswordPadre.php';

class CambiarPasswordPadreTest extends TestCase {
    private $conexion;
    private $id_padre;
    private $passwordActual;

    protected function setUp(): void
    {
        // Simular conexión a la base de datos
        $this->conexion = new mysqli("localhost", "usuario", "contraseña", "base_de_datos");

        // Crear un usuario de prueba
        $this->passwordActual = password_hash("clave123", PASSWORD_BCRYPT);
        $this->conexion->query("INSERT INTO padre (id_padre, password) VALUES (9999, '{$this->passwordActual}')");
        $this->id_padre = 9999;

        // Iniciar sesión simulada
        $_SESSION['id_padre'] = $this->id_padre;
    }

    public function testActualizarContrasenaCorrectamente()
    {
        // Simular entrada de usuario
        $data = [
            'passwordOld' => 'clave123',
            'password' => 'nuevaClave456'
        ];

        // Simular JSON de entrada
        $_POST = $data;
        ob_start();
        include __DIR__ . '/../cambiarDatosPadre/cambiarPasswordPadre.php';
        $output = ob_get_clean();

        // Verificar la respuesta
        $respuesta = json_decode($output, true);
        $this->assertTrue($respuesta['success']);
        $this->assertEquals("Contraseña actualizada correctamente", $respuesta['message']);

        // Verificar que la nueva contraseña está en la base de datos
        $result = $this->conexion->query("SELECT password FROM padre WHERE id_padre = $this->id_padre");
        $row = $result->fetch_assoc();
        $this->assertTrue(password_verify('nuevaClave456', $row['password']));
    }

    public function testFallaSiContrasenaAntiguaIncorrecta()
    {
        $data = [
            'passwordOld' => 'incorrecta',
            'password' => 'nuevaClave456'
        ];

        $_POST = $data;
        ob_start();
        include __DIR__ . '/../cambiarDatosPadre/cambiarPasswordPadre.php';
        $output = ob_get_clean();

        $respuesta = json_decode($output, true);
        $this->assertFalse($respuesta['success']);
        $this->assertEquals("La contraseña actual es incorrecta", $respuesta['message']);
    }

    protected function tearDown(): void
    {
        // Eliminar usuario de prueba
        $this->conexion->query("DELETE FROM padre WHERE id_padre = $this->id_padre");
        $this->conexion->close();
    }
}
?>