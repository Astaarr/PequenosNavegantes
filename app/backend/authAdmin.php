<?php
session_start();

if (!isset($_SESSION['id_admin'])) {
    echo json_encode(["auth" => false]);
    exit;
}

echo json_encode(["auth" => true]);
?>
