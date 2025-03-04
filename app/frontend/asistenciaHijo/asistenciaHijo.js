document.addEventListener("DOMContentLoaded", function() {
    axios.get('../../backend/authMonitor.php', { withCredentials: true })
    .then(response => {
        if (!response.data.auth) {
            window.location.href = "../loginMonitor/loginMonitor.html";
        }
    })
    .catch(error => {
        console.error("Error verificando sesión:", error);
        // En caso de error, redirige también para evitar accesos no deseados
        window.location.href = "../loginMonitor/loginMonitor.html";
    });
    axios.post("../../backend/monitor/getNinosGrupo.php", {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(respuesta => {
        console.log("📌 Respuesta del backend:", respuesta.data);

        if (!respuesta.data.success) {
            throw new Error("❌ No se pudo obtener la información de asistencia.");
        }

        // Insertar los datos en la vista
        document.getElementById('diaAsistencia').textContent = respuesta.data.fecha || "Fecha no disponible";
        document.getElementById('horaAsistencia').textContent = respuesta.data.hora || "Hora no disponible";
        document.getElementById('actividadAsistencia').textContent = respuesta.data.actividad || "Actividad no especificada";
        document.getElementById('grupoAsistencia').textContent = respuesta.data.nombre_grupo || "Grupo no especificado";

        const contenedor = document.getElementById("groupContainer");
        contenedor.innerHTML = ''; // Limpiar antes de agregar

        respuesta.data.ninos.forEach(nino => {
            contenedor.innerHTML += `
                <div class="tarjeta">
                    <span>${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span>¿Presente?</span>
                        <input type="checkbox" name="asistenciaHijo" data-id="${nino.id_hijo}"
                               ${nino.asistio ? 'checked' : ''}>
                    </div>
                </div>
            `;
        });

        // Agregar evento al botón de actualizar
        document.getElementById("guardarAsistencia").addEventListener("click", guardarAsistencia);
    })
    .catch(error => {
        console.error("❌ Error cargando datos de asistencia:", error);
        document.getElementById("groupContainer").innerHTML = "<p>Error al cargar la asistencia.</p>";
    });
});

// Función para guardar la asistencia de todos los niños seleccionados
function guardarAsistencia() {
    const checkboxes = document.querySelectorAll('input[name="asistenciaHijo"]');
    let asistenciaData = [];

    checkboxes.forEach(checkbox => {
        asistenciaData.push({
            id_hijo: checkbox.getAttribute('data-id'),
            asistio: checkbox.checked ? 1 : 0
        });
    });

    axios.post("../../backend/monitor/updateAsistencia.php", {
        asistencia: asistenciaData
    })
    .then(respuesta => {
        console.log("✅ Asistencia actualizada:", respuesta.data);
        document.getElementById("popupConfirmacion").style.display = "flex"; 
    })
    .catch(error => console.error("❌ Error al actualizar asistencia:", error));
}

// Cierra el popup y recarga la página
function closePopup() {
    document.getElementById("popupConfirmacion").style.display = "none";
    window.location.reload(); // Recargar para actualizar datos
}