<?php
use PHPUnit\Framework\TestCase;

class EliminarGrupoTest extends TestCase {
    protected $conexion;

    protected function setUp(): void
    {
        // Configurar la conexión para pruebas
        $this->conexion = new mysqli('host', 'usuario', 'contraseña', 'base_de_datos');
        $this->assertFalse($this->conexion->connect_error, "Debe conectar correctamente a la base de datos");
    }

    public function testEliminarGrupoSinSesionActiva()
    {
        // Simula una solicitud sin sesión activa
        unset($_SESSION);
        $output = $this->eliminarGrupo(1);
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => false, "message" => "No hay sesión activa."]),
            $output
        );
    }

    public function testEliminarGrupoSinID()
    {
        // Simula una solicitud sin ID de grupo
        $_SESSION = ['id' => 1];
        $output = $this->eliminarGrupo(null);
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => false, "message" => "ID de grupo no proporcionado."]),
            $output
        );
    }

    public function testEliminarGrupoExitoso()
    {
        // Simula una solicitud exitosa
        $_SESSION = ['id' => 1];
        $output = $this->eliminarGrupo(1);
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => true]),
            $output
        );
    }

    private function eliminarGrupo($id_grupo)
    {
        ob_start();
        // Simular el comportamiento del script principal con parámetros de prueba
        $_POST['id_grupo'] = $id_grupo;
        include '../admin/grupos/eliminar_grupo.php'; 
        $output = ob_get_clean();
        return $output;
    }

    protected function tearDown(): void
    {
        $this->conexion->close();
    }
}
