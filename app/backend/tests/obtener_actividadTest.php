<?php

use PHPUnit\Framework\TestCase;

class ActividadTest extends TestCase {
    public function testObtenerActividades()
    {
        // Simula la conexión a la base de datos
        $conexion = $this->createMock(mysqli::class);
        $conexion->method('query')->willReturn(true);

        // Simula el resultado de la consulta
        $resultado = $this->createMock(mysqli_result::class);
        $resultado->method('fetch_assoc')->willReturn([
            'nombre' => 'Actividad 1',
            'id_actividad' => 1,
            'descripcion' => 'Descripción de la actividad 1'
        ]);

        // Lógica de prueba
        $actividades = [];
        while ($fila = $resultado->fetch_assoc()) {
            $actividades[] = $fila;
        }

        $this->assertNotEmpty($actividades);
        $this->assertEquals('Actividad 1', $actividades[0]['nombre']);
    }
}
