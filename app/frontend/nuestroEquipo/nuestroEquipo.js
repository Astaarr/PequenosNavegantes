// Obtener elementos del DOM
const form = document.getElementById('formulario');

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto

    let formularioValido = true;

    inputs.forEach(input => {
        if (!validarCampoEspecifico(input)) {
            formularioValido = false;
        }
    });

    if (!formularioValido) return;

    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombreMonitor').value);
    formData.append('apellidos', document.getElementById('apellidosMonitor').value);
    formData.append('email', document.getElementById('emailMonitor').value);
    formData.append('telefono', document.getElementById('telMonitor').value);
    formData.append('curriculum', document.getElementById('curriculumMonitor').files[0]); // Obtener archivo

    axios.post('/PequenosNavegantes/app/backend/monitor/solicitud_monitor.php', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log(response.data);
        if (response.data.success) {
            document.getElementById("popupContainer").style.display = "flex";
        } else {
            alert(response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al enviar solicitud', error);
    });
});
