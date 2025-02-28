// Función para obtener el parámetro "token" de la URL
function obtenerParametroUrl(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

function submitCodigo() {
    const token = obtenerParametroUrl("token"); // Obtener el token de la URL
    const codigo = document.getElementById("codigoRecuperar").value.trim();

    if (!codigo) {
        alert("Por favor, ingresa el código de recuperación.");
        return;
    }

    axios.post('/PequenosNavegantes/app/backend/recuperar_password/solicitar_codigo.php', 
        { token, codigo }, 
        { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
        console.log(response.data);
        if (response.data.success) {
            // alert("Código correcto. Redirigiendo...");
            window.location.href = `nueva_password.html?token=${token}`; // Redirigir con el mismo token
        } else {
            alert(response.data.message);
        }
    })
    .catch(error => {
        console.error("Error al verificar el código:", error);
        alert("Error en la verificación. Inténtalo de nuevo.");
    });
}
