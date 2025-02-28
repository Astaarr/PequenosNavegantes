<?php

use PHPUnit\Framework\TestCase;

class EliminarActividadTest extends TestCase {
    private $mockConexion;
    private $mockStmt;

    protected function setUp(): void
    {
        // Mock de la conexión a la base de datos
        $this->mockConexion = $this->createMock(mysqli::class);
        $this->mockStmt = $this->createMock(mysqli_stmt::class);

        // Simulación de la conexión a la base de datos
        $this->mockConexion->method('prepare')->willReturn($this->mockStmt);
    }

    public function testEliminarActividad() {
        // Datos de la solicitud
        $data = [
            'id_actividad' => 1
        ];

        // Simulación de la respuesta al ejecutar la consulta
        $this->mockStmt->method('bind_param')->willReturn(true);
        $this->mockStmt->method('execute')->willReturn(true);

        // Iniciar la sesión
        $_SESSION = []; // Asegurar que la sesión está activa
        $_POST = json_encode($data);

        // Incluir el archivo a probar
        ob_start();
        include './app/backend/admin/actividades/eliminar_actividad.php'; 
        $output = ob_get_clean();

        // Verificar el resultado
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => true, "message" => "Actividad eliminada."]), $output);
    }

    public function testEliminarActividadError() {
        // Datos de la solicitud
        $data = [
            'id_actividad' => 1
        ];

        // Simulación de la respuesta al ejecutar la consulta
        $this->mockStmt->method('bind_param')->willReturn(true);
        $this->mockStmt->method('execute')->willReturn(false);

        // Iniciar la sesión
        $_SESSION = []; // Asegurar que la sesión está activa
        $_POST = json_encode($data);

        // Incluir el archivo a probar
        ob_start();
        include './app/backend/admin/actividades/eliminar_actividad.php'; 
        $output = ob_get_clean();

        // Verificar el resultado
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => false, "message" => "Error al eliminar actividad."]), $output);
    }

    public function testDatosInvalidos() {
        // Datos de la solicitud
        $data = [];

        // Iniciar la sesión
        $_SESSION = []; // Asegurar que la sesión está activa
        $_POST = json_encode($data);

        // Incluir el archivo a probar
        ob_start();
        include './app/backend/admin/actividades/eliminar_actividad.php'; 
        $output = ob_get_clean();

        // Verificar el resultado
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => false, "message" => "Datos inválidos."]), $output);
    }
}

?>
