<?php
include 'conecta.php';

$email = $_POST['email'];
$password = $_POST['password'];

$sqlLogin = "SELECT * FROM padre WHERE email = '$email' and password = '$dni'";
$result = mysqli_query($conexion, $sqlLogin) or die("Error al verificar el usuario: " . mysqli_error($conexion));

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    session_start();
    $_SESSION['DNI'] = $user['DNI'];
    $_SESSION['nombre'] = $user['nombre'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['telefono'] = $user['telefono'];
    header('Location: ../padre.php');
} else {
    header('Location: ../login.php?error=1');
}
