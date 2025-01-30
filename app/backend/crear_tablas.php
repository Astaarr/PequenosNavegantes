<?php
include 'conecta.php'; // Incluye la conexión a la base de datos

// Crear la base de datos si no existe
$sqlCrearDB = "CREATE DATABASE IF NOT EXISTS pequenosnavegantes";
mysqli_query($conexion, $sqlCrearDB) or die("Error al crear la base de datos 'pequenosnavegantes': " . mysqli_error($conexion));

// Seleccionar la base de datos
if (!mysqli_select_db($conexion, "pequenosnavegantes")) {
    die("Error al seleccionar la base de datos 'pequenosnavegantes': " . mysqli_error($conexion));
}

// Función para verificar si existe una tabla
function verificarTabla($conexion, $tabla) {
    $sql = "SHOW TABLES FROM pequenosnavegantes LIKE '$tabla'";
    $query = mysqli_query($conexion, $sql) or die("Error al verificar la tabla '$tabla': " . mysqli_error($conexion));
    return mysqli_fetch_array($query) > 0;
}

// Verifica y crea la tabla 'padre' 
if (!verificarTabla($conexion, 'padre')){
    $sqlPadre = "CREATE TABLE padre (
        DNI VARCHAR(9) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(16) NOT NULL
        )";
    mysqli_query($conexion, $sqlPadre) or die("Error al crear la tabla 'padre': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'padre'
    $sqlPadreInsert = "INSERT INTO padre (DNI, nombre, password, email, telefono) VALUES
        ('12345678A', 'Daniel Clavel', 'padre123', 'ejemplo@gmail.conm', '600123456'),
        ('23456789B', 'Adri Arcones', 'padre456', 'ejemplo2@gmail.com', '611987654')";
    mysqli_multi_query($conexion, $sqlPadreInsert) or die("Error al insertar datos en 'padre': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'hijo'
if (!verificarTabla($conexion, 'hijo')){
    $sqlHijo = "CREATE TABLE hijo (
        DNI VARCHAR(9) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        medicacion TEXT,
        alergias TEXT,
        datos_adicionales TEXT,
        DNI_padre VARCHAR(9) NOT NULL,
        id_grupo INT, 
        FOREIGN KEY (DNI_padre) REFERENCES padre(DNI) ON DELETE CASCADE,
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlHijo) or die("Error al crear la tabla 'hijo': " . mysqli_error($conexion));
    
    // Insertar datos en la tabla 'hijo'
    $sqlHijoInsert = "INSERT INTO hijo (DNI, nombre, apellidos, fecha_nacimiento, medicacion, alergias, datos_adicionales, DNI_padre) VALUES
        ('12345678A', 'Daniel', 'Clavel', '2015-11-15', 'Ninguna', 'Ninguna', 'Ninguna', '12345678A'),
        ('23456789B', 'Adri', 'Arcones', '2018-04-23', 'Ninguna', 'Ninguna', 'Ninguna', )";
    mysqli_multi_query($conexion, $sqlHijoInsert) or die("Error al insertar datos en 'hijo': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'grupo'
if(!verificarTabla($conexion, 'grupo')){
    $sqlGrupo = "CREATE TABLE grupo (
        id_grupo INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        id_monitor VARCHAR(9),
        FOREIGN KEY (id_monitor) REFERENCES monitor(DNI) ON DELETE SET NULL
        )";
    mysqli_query($conexion, $sqlGrupo) or die("Error al crear la tabla 'grupo': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'grupo'
    $sqlGrupoInsert = "INSERT INTO grupo (nombre, id_monitor) VALUES
        ('Grupo 1', '34567890C'),
        ('Grupo 2', '45678901D')";
    mysqli_multi_query($conexion, $sqlGrupoInsert) or die("Error al insertar datos en 'grupo': " . mysqli_error($conexion));
}

// Verifica y crea tabla 'monitor
if(!verificarTabla($conexion, 'monitor')){
    $sqlMonitor = "CREATE TABLE monitor (
        DNI VARCHAR(9) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(16) NOT NULL,
        curriculum TEXT
        )";
    mysqli_query($conexion, $sqlMonitor) or die("Error al crear la tabla 'monitor': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'monitor'
    $sqlMonitorInsert = "INSERT INTO monitor (DNI, nombre, apellidos, password, email, telefono, curriculum) VALUES
        ('34567890C', 'Juan', 'Perez', 'monitor123', 'juan.perez@example.com', '622345678', 'uploads/curriculums/cv_juan_perez.pdf'),
        ('45678901D', 'Maria', 'Garcia', 'monitor456', 'maria.gomez@example.com', '633456789', 'uploads/curriculums/cv_maria_garcia.pdf')";
    mysqli_multi_query($conexion, $sqlMonitorInsert) or die("Error al insertar datos en 'monitor': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'actividad'
if(!verificarTabla($conexion,'actividad')){
    $sqlActividad = "CREATE TABLE actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL
    )";
    mysqli_query($conexion, $sqlActividad) or die("Error al crear la tabla 'actividad': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'actividad'
    $sqlActividadInsert = "INSERT INTO actividad (nombre, descripcion) VALUES
        ('Actividad 1', 'Descripcion de la actividad 1'),
        ('Actividad 2', 'Descripcion de la actividad 2')";
}

// Verifica y crea la tabla 'programacion_actividad'
if(!verificarTabla($conexion, 'programacion_actividad')){
    $sqlProgramacionActividad = "CREATE TABLE programacion_actividad (
        id_monitor VARCHAR(9),
        id_actividad INT,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        lugar VARCHAR(255) NOT NULL,
        PRIMARY KEY (id_monitor, id_actividad),
        FOREIGN KEY (id_monitor) REFERENCES monitor(DNI) ON DELETE CASCADE,
        FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlProgramacionActividad) or die("Error al crear la tabla 'programacion_actividad': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'programacion_actividad'
    $sqlProgramacionActividadInsert = "INSERT INTO programacion_actividad (id_monitor, id_actividad, hora_inicio, hora_fin, lugar) VALUES
        ('34567890C', 1, '10:00:00', '12:00:00', 'Patio'),
        ('45678901D', 2, '10:00:00', '12:00:00', 'Patio')";
}

// Verifica y crea la tabla 'asistencia'
if(!verificarTabla($conexion, 'asistencia')){
    $sqlAsistencia = "CREATE TABLE asistencia (
        id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        asistio BOOLEAN NOT NULL,
        DNI_hijo VARCHAR(9) NOT NULL,
        id_actividad INT NOT NULL,
        FOREIGN KEY (DNI_hijo) REFERENCES hijo(DNI) ON DELETE CASCADE,
        FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlAsistencia) or die("Error al crear la tabla 'asistencia': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'asistencia'
    $sqlAsistenciaInsert = "INSERT INTO asistencia (fecha, asistio, DNI_hijo, id_actividad) VALUES
        ('2021-06-01', 1, '12345678A', 1),
        ('2021-06-01', 1, '23456789B', 2)";
    mysqli_multi_query($conexion, $sqlAsistenciaInsert) or die("Error al insertar datos en 'asistencia': " . mysqli_error($conexion));
}

// Tabla 'comunicacion' para gestionar mensajes entre padres y administración
/*
if (!verificarTabla($conexion, 'comunicacion')){
    $sqlComunicacion = "CREATE TABLE comunicacion (
        id_comunicacion INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        asunto VARCHAR(100) NOT NULL,
        mensaje TEXT NOT NULL,
        DNI_padre VARCHAR(9) NOT NULL,
        FOREIGN KEY (DNI_padre) REFERENCES padre(DNI) ON DELETE CASCADE
    )";
    mysqli_query($conexion, $sqlComunicacion) or die("Error al crear la tabla 'comunicacion': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'comunicacion'
    $sqlComunicacionInsert = "INSERT INTO comunicacion (fecha, asunto, mensaje, DNI_padre) VALUES
        ('2021-06-01', 'Asunto 1', 'Mensaje de la comunicación 1', '12345678A'),
        ('2021-06-01', 'Asunto 2', 'Mensaje de la comunicación 2', '23456789B')";
    mysqli_multi_query($conexion, $sqlComunicacionInsert) or die("Error al insertar datos en 'comunicacion': " . mysqli_error($conexion));
}
*/