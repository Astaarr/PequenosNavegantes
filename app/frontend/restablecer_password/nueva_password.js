// Función para obtener el parámetro "token" de la URL
function obtenerParametroUrl(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Enviar nueva contraseña con el token de la URL
function submitPassword() {
    const nuevaPassword = document.getElementById("nuevaPassword").value.trim();
    const token = obtenerParametroUrl("token"); // Obtener el token desde la URL

    axios.post('/PequenosNavegantes/app/backend/recuperar_password/nueva_password.php', 
        { nuevaPassword, token }, 
        { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
        console.log(response.data);
        if (response.data.success) {
            alert("Contraseña cambiada correctamente.");
            window.location.href = "../login/login.html"; 
        } else {
            alert(response.data.message);
        }
    })
    .catch(error => {
        console.error("Error al cambiar la contraseña:", error);
        alert("Error al actualizar la contraseña.");
    });
}
