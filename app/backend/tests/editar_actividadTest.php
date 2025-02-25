<?php

use PHPUnit\Framework\TestCase;
require_once "../admin/actividades/editar_actividad.php"; //no funciona la ruta

class EditarActividadTest extends TestCase {
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

    public function testEditarActividad() {
        // Datos de la solicitud
        $data = [
            'id_actividad' => 1,
            'nombre' => 'Nueva Actividad',
            'descripcion' => 'Descripción de la nueva actividad',
        ];

        // Simulación de la respuesta al ejecutar la consulta
        $this->mockStmt->method('bind_param')->willReturn(true);
        $this->mockStmt->method('execute')->willReturn(true);
        
        // Iniciar la sesión
        $_SESSION = []; // Asegurar que la sesión está activa
        $_POST = json_encode($data);
        
        // Incluir el archivo a probar
        ob_start();
        include './app/backend/admin/actividades/editar_actividad.php';
        $output = ob_get_clean();
        
        // Verificar el resultado
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => true]), $output);
    }

    public function testAgregarActividad() {
        // Datos de la solicitud
        $data = [
            'nombre' => 'Nueva Actividad',
            'descripcion' => 'Descripción de la nueva actividad',
        ];

        // Simulación de la respuesta al ejecutar la consulta
        $this->mockStmt->method('bind_param')->willReturn(true);
        $this->mockStmt->method('execute')->willReturn(true);
        
        // Iniciar la sesión
        $_SESSION = []; // Asegurar que la sesión está activa
        $_POST = json_encode($data);
        
        // Incluir el archivo a probar
        ob_start();
        include './app/backend/admin/actividades/editar_actividad.php';
        $output = ob_get_clean();
        
        // Verificar el resultado
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => true]), $output);
    }
}

?>
