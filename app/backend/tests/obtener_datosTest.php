<?php
use PHPUnit\Framework\TestCase;
use Mockery;

class ObtenerDatosTest extends TestCase {
    protected $conexionMock;
    protected function setUp(): void
    {
        $this->conexionMock = Mockery::mock(mysqli::class);
    }

    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function testObtenerMonitores()
    {
        $mockResult = Mockery::mock(mysqli_result::class);
        $mockResult->shouldReceive('fetch_assoc')->times(2)->andReturn(
            ['id_monitor' => 1, 'nombre' => 'Juan', 'apellidos' => 'Pérez'],
            ['id_monitor' => 2, 'nombre' => 'Ana', 'apellidos' => 'Gómez'],
            null
        );

        $this->conexionMock->shouldReceive('query')->andReturn($mockResult);
        
        ob_start();
        include '././app/backend/admin/grupos/obtener_datos.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);
        
        $this->assertTrue($response['success']);
        $this->assertCount(2, $response['monitores']);
    }
    
    public function testObtenerNinosSinGrupo()
    {
        $mockResult = Mockery::mock(mysqli_result::class);
        $mockResult->shouldReceive('fetch_assoc')->times(1)->andReturn(
            ['id_hijo' => 1, 'nombre' => 'Carlos', 'apellidos' => 'López'],
            null
        );

        $this->conexionMock->shouldReceive('query')->andReturn($mockResult);
        
        ob_start();
        include '././app/backend/admin/grupos/obtener_datos.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);
        
        $this->assertTrue($response['success']);
        $this->assertCount(1, $response['ninos']);
    }
}
