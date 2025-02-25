<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../conecta.php';

class CargarDatosPadreTest extends TestCase {
    private $conexion;
    private $id_padre;
    private $datosPadre;

    protected function setUp(): void
    {
        // Simular conexión a la base de datos
        $this->conexion = new mysqli("localhost", "usuario", "contraseña", "base_de_datos");

        // Crear un usuario de prueba
        $this->id_padre = 9999;
        $this->datosPadre = [
            'nombre' => 'Juan Pérez',
            'dni' => '12345678A',
            'telefono' => '600123456',
            'telefono_adicional' => '611987654'
        ];

        $this->conexion->query("INSERT INTO padre (id_padre, nombre, dni, telefono, telefono_adicional) 
                                VALUES (
                                    $this->id_padre, 
                                    '{$this->datosPadre['nombre']}', 
                                    '{$this->datosPadre['dni']}', 
                                    '{$this->datosPadre['telefono']}', 
                                    '{$this->datosPadre['telefono_adicional']}'
                                )");

        // Iniciar sesión simulada
        $_SESSION['id_padre'] = $this->id_padre;
    }

    public function testObtenerInformacionUsuarioCorrectamente()
    {
        // Capturar la salida del script
        ob_start();
        include __DIR__ . '/../cambiarDatosPadre/cargarDatosPadre.php';
        $output = ob_get_clean();

        // Decodificar respuesta JSON
        $respuesta = json_decode($output, true);

        $this->assertTrue($respuesta['success']);
        $this->assertEquals($this->datosPadre['nombre'], $respuesta['nombre']);
        $this->assertEquals($this->datosPadre['dni'], $respuesta['dni']);
        $this->assertEquals($this->datosPadre['telefono'], $respuesta['telefono']);
        $this->assertEquals($this->datosPadre['telefono_adicional'], $respuesta['telefono_adicional']);
    }

    public function testUsuarioNoAutenticado()
    {
        // Simular que no hay sesión iniciada
        unset($_SESSION['id_padre']);

        ob_start();
        include __DIR__ . '/../cambiarDatosPadre/cargarDatosPadre.php';
        $output = ob_get_clean();

        $respuesta = json_decode($output, true);
        $this->assertFalse($respuesta['success']);
        $this->assertEquals("Usuario no autenticado", $respuesta['message']);
    }

    protected function tearDown(): void
    {
        // Eliminar usuario de prueba
        $this->conexion->query("DELETE FROM padre WHERE id_padre = $this->id_padre");
        $this->conexion->close();
    }
}
?>