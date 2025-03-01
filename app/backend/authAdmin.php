<?php
session_start();

if (!isset($_SESSION['id_admin'])) {
    header("Location: /PequenosNavegantes/app/frontend/login.html");
    exit;
}
?>
