<?php

use PHPUnit\Framework\TestCase;

class editar_actividadTest extends TestCase
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
     * Prueba para insertar una actividad en la base de datos.
     * Se verifica que la consulta de inserción se ejecute correctamente.
     */
    public function testInsertarActividad()
    {
        // Preparar la consulta para insertar una nueva actividad
        $sql = "INSERT INTO actividad (nombre, descripcion) VALUES (?, ?)";
        $stmt = $this->conexion->prepare($sql);

        // Definir los valores de prueba
        $nombre = "Prueba Actividad";
        $descripcion = "Descripción de prueba";
        $stmt->bind_param("ss", $nombre, $descripcion);

        // Ejecutar la consulta y comprobar que no da error
        $this->assertTrue($stmt->execute(), "Error al insertar la actividad: " . $stmt->error);
        $stmt->close();
    }

    /**
     * Prueba para editar una actividad en la base de datos.
     * 1. Se inserta una actividad de prueba.
     * 2. Se actualizan sus valores con una consulta UPDATE.
     * 3. Se verifica que la actualización se ejecute correctamente.
     */
    public function testEditarActividad()
    {
        // 1️⃣ Insertar una actividad de prueba en la tabla "actividad"
        $sqlInsert = "INSERT INTO actividad (nombre, descripcion) VALUES (?, ?)";
        $stmtInsert = $this->conexion->prepare($sqlInsert);

        // Definir valores iniciales
        $nombre = "Temporal";
        $descripcion = "Descripción temporal";
        $stmtInsert->bind_param("ss", $nombre, $descripcion);
        $stmtInsert->execute();

        // Obtener el ID de la actividad recién insertada
        $id_actividad = $this->conexion->insert_id;
        $stmtInsert->close();

        // 2️⃣ Editar la actividad insertada
        $sqlUpdate = "UPDATE actividad SET nombre = ?, descripcion = ? WHERE id_actividad = ?";
        $stmtUpdate = $this->conexion->prepare($sqlUpdate);

        // Definir nuevos valores para la actividad
        $nuevoNombre = "Actividad Editada";
        $nuevaDescripcion = "Descripción editada";
        $stmtUpdate->bind_param("ssi", $nuevoNombre, $nuevaDescripcion, $id_actividad);

        // 3️⃣ Ejecutar la actualización y verificar que no da error
        $this->assertTrue($stmtUpdate->execute(), "Error al actualizar la actividad: " . $stmtUpdate->error);
        $stmtUpdate->close();
    }
}
