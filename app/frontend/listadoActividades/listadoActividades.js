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
    // Cargar actividades al iniciar la página
    cargarActividades();
});

// Función para cargar y mostrar las actividades
function cargarActividades() {
    axios.get('../../backend/admin/actividades/obtener_actividad.php')
    .then(response => {
        if (response.data.success) {
            const groupContainer = document.getElementById("groupContainer");
            groupContainer.innerHTML = `<span class="add-button" onclick="abrirPopupEdicion()"><i class="fa-solid fa-plus"></i></span>`;

            // Agregar tarjeta por cada actividad
            response.data.actividades.forEach(actividad => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta", "tarjetaHover");
                tarjeta.dataset.id = actividad.id_actividad;

                tarjeta.innerHTML = `
                    <div class="texto">
                        <i class="fa-solid fa-play"></i>
                        <span class="name"> ${actividad.nombre}</span>
                        <span class="descripcion hidden"> ${actividad.descripcion}</span>
                    </div>
                    
                    <div class="icons">
                        <span class="icon edit" onclick="abrirPopupEdicion(${actividad.id_actividad}, '${actividad.nombre}', '${actividad.descripcion}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </span>
                        <span class="icon delete" onclick="mostrarPopupConfirmacion(${actividad.id_actividad}, '${actividad.nombre}')">
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>
                `;

                // Agregar evento de clic a la tarjeta
                tarjeta.addEventListener("click", function(event) {
                    // Evitar que el evento se propague a los íconos dentro de la tarjeta
                    if (event.target.closest('.icons')) return;

                    const iconoPlay = this.querySelector(".texto i");
                    const nombreSpan = this.querySelector(".name");
                    const descripcionSpan = this.querySelector(".descripcion");
                    const icons = this.querySelectorAll(".icon");

                    // Rotar el ícono 90 grados
                    iconoPlay.style.transform = iconoPlay.style.transform === "rotate(90deg)" ? "rotate(0deg)" : "rotate(90deg)";

                    // Alternar las clases hidden
                    nombreSpan.classList.toggle("hidden");
                    descripcionSpan.classList.toggle("hidden");
                    icons.forEach(icon => {
                        icon.classList.toggle("hidden");
                    });


                });

                groupContainer.appendChild(tarjeta);
            });
        } else {
            console.error("Error al obtener actividades:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener actividades:', error);
    });
}

// Función para abrir el popup de edición
function abrirPopupEdicion(id = null, nombre = '', descripcion = '') {
    const popup = document.getElementById("popupEdicion");
    const nombreActividad = document.getElementById("nombreActividad");
    const detallesActividad = document.getElementById("detallesActividad");

    // Si se pasa un ID, es una edición, si no, es una nueva actividad
    if (id) {
        document.getElementById("tituloAccion").innerHTML = "Editar Actividad";
        nombreActividad.value = nombre;
        detallesActividad.value = descripcion;
        popup.dataset.id = id;
    } else {
        document.getElementById("tituloAccion").innerHTML = "Crear Actividad";
        nombreActividad.value = '';
        detallesActividad.value = '';
        popup.dataset.id = '';
    }

    // Mostrar el popup
    popup.style.display = "flex";
}

// Función para guardar la actividad
function guardarActividad() {
    const popup = document.getElementById("popupEdicion");
    const id = popup.dataset.id;
    const nombreInput = document.getElementById("nombreActividad");
    const descripcion = document.getElementById("detallesActividad").value;

    // Validar el campo nombreActividad
    if (!validarCampoEspecifico(nombreInput)) {
        return; // Detener la ejecución si el campo no es válido
    }

    const nombre = nombreInput.value.trim();

    const data = {
        id_actividad: id,
        nombre: nombre,
        descripcion: descripcion
    };

    axios.post("/PequenosNavegantes/app/backend/admin/actividades/editar_actividad.php", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            closePopup();
            cargarActividades();
        } else {
            alert("Error al guardar la actividad.");
        }
    })
    .catch(error => {
        console.error("Error guardando actividad:", error);
    });
}


// Función para mostrar el popup de confirmación de eliminación
function mostrarPopupConfirmacion(id, nombre) {
    const popup = document.getElementById("popupConfirmacion");
    const nombreActividadEliminar = document.getElementById("nombreActividadEliminar");

    // Mostrar el nombre de la actividad en el popup
    nombreActividadEliminar.textContent = nombre;

    // Guardar el ID de la actividad en el popup
    popup.dataset.id = id;

    // Mostrar el popup
    popup.style.display = "flex";
}

// Función para confirmar la eliminación de una actividad
function confirmarEliminacion() {
    const popup = document.getElementById("popupConfirmacion");
    const id = popup.dataset.id; // Recuperar el ID del popup para eliminarlo

    axios.post("/PequenosNavegantes/app/backend/admin/actividades/eliminar_actividad.php", JSON.stringify({ id_actividad: id }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            cargarActividades(); // Recargar la lista de actividades
        } else {
            alert("Error al eliminar la actividad.");
        }
    })
    .catch(error => {
        console.error("Error eliminando actividad:", error);
    });

    closePopup();
}

