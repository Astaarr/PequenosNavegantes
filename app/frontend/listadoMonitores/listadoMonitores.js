document.addEventListener("DOMContentLoaded", function () {
    axios.get('../../backend/authAdmin.php', { withCredentials: true })
    .then(response => {
        if (!response.data.auth) {
            window.location.href = "../loginAdmin/loginAdmin.html";
        }
    })
    .catch(error => {
        console.error("Error verificando sesión:", error);
        // En caso de error, redirige también para evitar accesos no deseados
        window.location.href = "../loginAdmin/loginAdmin.html";
    });
    cargarMonitores();
});

// Función para cargar y mostrar los monitores
function cargarMonitores() {
    axios.get('../../backend/monitor/obtener_monitores.php')
        .then(response => {
            console.log("Respuesta del servidor:", response.data); // Depuración

            if (response.data && response.data.success) {
                const monitores = response.data.monitores;
                const contenedorTarjetas = document.getElementById("groupContainer");

                // Limpiar el contenedor antes de agregar nuevas tarjetas
                contenedorTarjetas.innerHTML = '';

                monitores.forEach(monitor => {
                    const tarjeta = document.createElement('div');
                    tarjeta.classList.add('t4', 'tarjeta', 'columna');
                    tarjeta.setAttribute('data-id', monitor.id_solicitud);

                    tarjeta.innerHTML = `
                        <div class="nombreCompleto">
                            <h6>${monitor.nombre} ${monitor.apellidos}</h6>
                        </div>

                        <div class="detalles">
                            <span class="correo"><i class="fa-solid fa-envelope"></i>${monitor.email}</span>
                            <span class="telefono"><i class="fa-solid fa-phone"></i>${monitor.telefono}</span>
                        </div>

                        <div class="infoAdicional">
                            <span class="curriculum"><i class="fa-solid fa-file"></i> Descargar CV</span>
                        </div>

                        <div class="acciones">
                                <span class="icon" onclick="mostrarPopupAceptar(${monitor.id_solicitud}, '${monitor.nombre} ${monitor.apellidos}')">
                                <i class="fa-solid fa-user-plus"></i>
                                </span>                            
                                <span class="icon delete" onclick="mostrarPopupEliminar(${monitor.id_solicitud}, '${monitor.nombre} ${monitor.apellidos}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </span>
                        </div>
                    `;

                    // Añadir evento de clic para descargar el CV
                    const curriculumSpan = tarjeta.querySelector('.curriculum');
                    curriculumSpan.addEventListener('click', () => {
                        descargarCurriculum(monitor.curriculum, monitor.nombre, monitor.apellidos);
                    });

                    console.log(monitor.curriculum);

                    contenedorTarjetas.appendChild(tarjeta);
                });
            } else {
                console.error("Error al obtener monitores:", response.data ? response.data.message : "Respuesta no válida del servidor");
                alert("Error: " + (response.data ? response.data.message : "No se pudo cargar la información de los monitores."));
            }
        })
        .catch(error => {
            console.error('Error al obtener monitores:', error);
            alert("Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.");
        });
}

// Función para mostrar el popup de eliminación
function mostrarPopupEliminar(id_solicitud, nombreCompleto) {
    document.getElementById("nombreMonitor").textContent = nombreCompleto;

    // Seleccionar el botón correctamente
    const btnEliminar = document.getElementById("btnConfirmarEliminar");

    if (btnEliminar) {
        btnEliminar.onclick = function () {
            eliminarSolicitud(id_solicitud);
        };
    }

    document.getElementById("popupEliminar").style.display = "flex";
}


// Función para cerrar el popup
function closePopup() {
    document.getElementById("popupAddMonitor").style.display = "none";
    document.getElementById("popupEliminar").style.display = "none";
}

// Función para eliminar una solicitud de monitor
function eliminarSolicitud(id_solicitud) {
    axios.post('../../backend/monitor/denegar_solicitud.php', { id_solicitud })
        .then(response => {
            if (response.data.success) {
                document.querySelector(`.tarjeta[data-id='${id_solicitud}']`).remove();
                closePopup();
            } else {
                alert("Error al eliminar la solicitud");
            }
        })
        .catch(error => {
            console.error("Error al eliminar la solicitud:", error);
        });
}

// Función para mostrar el popup de aceptar solicitud
function mostrarPopupAceptar(id_solicitud, nombreCompleto) {
    document.getElementById("nombreMonitorAceptar").textContent = `Añadir ${nombreCompleto}`;
    
    // Guardar el ID en el botón de confirmación
    const btnAceptar = document.getElementById("btnAceptarMonitor");

    if (btnAceptar) {
        btnAceptar.onclick = function () {
            aceptarSolicitud(id_solicitud);
        };
    } else {
        console.error("Error: El botón btnAceptarMonitor no existe en el DOM.");
    }

    document.getElementById("popupAddMonitor").style.display = "flex";
}


// Funcion aceptar solicitud
function aceptarSolicitud(id_solicitud) {
    const dni = document.getElementById("dniMonitor").value;
    const password = document.getElementById("passwordMonitor").value;

    if (!dni || !password) {
        return;
    }

    axios.post('../../backend/monitor/aceptar_solicitud.php', {
        id_solicitud: id_solicitud,
        dni: dni,
        password: password
    })
    .then(response => {
        if (response.data.success) {
            // Eliminar la tarjeta de la UI
            document.querySelector(`.tarjeta[data-id='${id_solicitud}']`).remove();
            // Cerrar el popup después de aceptar
            closePopup();
        } else {
            alert("Error al aceptar la solicitud: " + response.data.message);
        }
    })
    .catch(error => {
        console.error("Error al aceptar la solicitud:", error);
    });
}



// Función para descargar el CV
function descargarCurriculum(urlCurriculum, nombre, apellidos) {
    const rutaCorrecta = `../../backend/monitor/${urlCurriculum}`;
    const link = document.createElement('a');
    link.href = rutaCorrecta;
    link.download = `curriculum_${nombre}_${apellidos}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 
