<?php

use PHPUnit\Framework\TestCase;

class eliminar_grupoTest extends TestCase
{
    private $conexion;
    private $host = "localhost";
    private $usuario = "root";
    private $password = "";
    private $dbname = "pequenosnavegantes";

    /**
     * Configuración inicial antes de ejecutar cada test.
     * Se establece la conexión a la base de datos.
     */
    protected function setUp(): void
    {
        // Intentar conectar a la base de datos
        $this->conexion = new mysqli($this->host, $this->usuario, $this->password, $this->dbname);

        // Verificar si hubo error en la conexión
        if ($this->conexion->connect_error) {
            $this->fail("Error al conectar con MySQL: " . $this->conexion->connect_error);
        }
    }

    /**
     * Limpieza después de cada test.
     * Se cierra la conexión a la base de datos.
     */
    protected function tearDown(): void
    {
        $this->conexion->close();
    }

    /**
     * Prueba la eliminación de un grupo en la base de datos.
     * 1. Inserta un grupo de prueba en la base de datos.
     * 2. Elimina dicho grupo utilizando una consulta DELETE.
     * 3. Verifica que el grupo ya no existe en la base de datos.
     */
    public function testEliminarGrupo()
    {
        // 1️ Insertar un grupo de prueba en la tabla "grupo"
        $sqlInsert = "INSERT INTO grupo (nombre) VALUES (?)";
        $stmtInsert = $this->conexion->prepare($sqlInsert);
        $nombreGrupo = "Grupo de prueba";
        $stmtInsert->bind_param("s", $nombreGrupo);
        $stmtInsert->execute();

        // Obtener el ID del grupo recién insertado
        $id_grupo = $this->conexion->insert_id;
        $stmtInsert->close();

        // 2️ Intentar eliminar el grupo insertado
        $sqlDelete = "DELETE FROM grupo WHERE id_grupo = ?";
        $stmtDelete = $this->conexion->prepare($sqlDelete);
        $stmtDelete->bind_param("i", $id_grupo);
        $resultado = $stmtDelete->execute();
        $stmtDelete->close();

        // 3️ Verificar que el grupo ha sido eliminado
        $sqlCheck = "SELECT id_grupo FROM grupo WHERE id_grupo = ?";
        $stmtCheck = $this->conexion->prepare($sqlCheck);
        $stmtCheck->bind_param("i", $id_grupo);
        $stmtCheck->execute();
        $stmtCheck->store_result();
        $numRows = $stmtCheck->num_rows;
        $stmtCheck->close();

        // 4️ Comprobar que la eliminación fue exitosa
        $this->assertTrue($resultado, "Error al eliminar el grupo.");
        $this->assertEquals(0, $numRows, "El grupo no fue eliminado correctamente.");
    }
}
