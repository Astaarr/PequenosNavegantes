<?php
use PHPUnit\Framework\TestCase;

class GestionarGrupoTest extends TestCase {
    private $conexion;

    protected function setUp(): void
    {
        // Mock de la conexión a la base de datos
        $this->conexion = $this->createMock(mysqli::class);
    }

    public function testGuardarGrupoNuevo()
    {
        // Simula una inserción de un nuevo grupo
        $stmtMock = $this->createMock(mysqli_stmt::class);
        $stmtMock->method('execute')->willReturn(true);
        $stmtMock->method('insert_id')->willReturn(1);
        
        $this->conexion->method('prepare')->willReturn($stmtMock);

        // Datos simulados
        $data = [
            'accion' => 'guardar_grupo',
            'nombre' => 'Grupo A',
            'id_monitor' => 2,
            'ninos' => [['id_hijo' => 3], ['id_hijo' => 4]]
        ];

        // Simula la ejecución del script con estos datos
        ob_start();
        include '../admin/grupos/gestionar_grupo.php';
        $output = ob_get_clean();
        
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => true, "id_grupo" => 1]), $output);
    }

    public function testEliminarMonitor()
    {
        // Simula la eliminación de un monitor
        $stmtMock = $this->createMock(mysqli_stmt::class);
        $stmtMock->method('execute')->willReturn(true);

        $this->conexion->method('prepare')->willReturn($stmtMock);

        $data = ['accion' => 'eliminar_monitor', 'id' => 5];

        ob_start();
        include '../admin/grupos/gestionar_grupo.php';
        $output = ob_get_clean();
        
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => true]), $output);
    }

    public function testEliminarNino()
    {
        // Simula la eliminación de un niño de un grupo
        $stmtMock = $this->createMock(mysqli_stmt::class);
        $stmtMock->method('execute')->willReturn(true);

        $this->conexion->method('prepare')->willReturn($stmtMock);

        $data = ['accion' => 'eliminar_nino', 'id' => 3];

        ob_start();
        include '../admin/grupos/gestionar_grupo.php';
        $output = ob_get_clean();
        
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => true]), $output);
    }

    public function testAgregarNinoYaEnGrupo()
    {
        // Simula un niño que ya está en otro grupo
        $stmtMock = $this->createMock(mysqli_stmt::class);
        $stmtMock->method('execute')->willReturn(true);

        $resultadoMock = $this->createMock(mysqli_result::class);
        $resultadoMock->method('fetch_assoc')->willReturn(['id_grupo' => 2]);

        $this->conexion->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('get_result')->willReturn($resultadoMock);

        $data = ['accion' => 'agregar_nino', 'id_hijo' => 3, 'id_grupo' => 1];

        ob_start();
        include '../admin/grupos/gestionar_grupo.php';
        $output = ob_get_clean();
        
        $this->assertJsonStringEqualsJsonString(json_encode(["success" => false, "message" => "El niño ya está en otro grupo."]), $output);
    }
}
