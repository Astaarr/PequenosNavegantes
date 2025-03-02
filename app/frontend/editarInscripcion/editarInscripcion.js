document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idInscripcion = urlParams.get("id_inscripcion");

    if (idInscripcion) {
        cargarDatosInscripcion(idInscripcion);
    }
});

// Función para cargar los datos de la inscripción desde el backend
function cargarDatosInscripcion(id) {
    axios.post('../../backend/cambiarDatosPadre/obtenerInscripcion.php', { id_inscripcion: id })
        .then(response => {
            if (response.data.success) {
                const datos = response.data.inscripcion;
                
                // Asignar valores al HTML
                document.getElementById("nombreHijo").innerText = `${datos.nombre_hijo} ${datos.apellidos_hijo}`;
                document.getElementById("estadoPago").innerText = datos.estado_pago;
                document.getElementById("precioTotal").innerText = `${datos.precio}€`;
                document.getElementById("planSeleccionado").innerText = datos.plan;
                document.getElementById("descuentos").innerText = datos.descuentos || "Ninguno";
                document.getElementById("diasSeleccionados").innerText = datos.fecha_json ? datos.fecha_json.join(", ") : "No hay fechas";

                // Información adicional del niño (Checkbox y Campos de Texto)
                marcarCheckbox("checkboxAlergia", "alergiaHijo", datos.alergias);
                marcarCheckbox("checkboxMedicacion", "medicacionActual", datos.medicacion);
                document.getElementById("infoAdicionalHijo").value = datos.datos_adicionales || "";

                // Información de recogida (Detectar si hay datos)
                let recogidaTieneDatos = datos.nombre_autorizado || datos.dni_autorizado || datos.telefono_autorizado;
                marcarCheckbox("checkboxRecogida", "nombreAutorizado", recogidaTieneDatos ? datos.nombre_autorizado : "");
                document.getElementById("dniAutorizado").value = datos.dni_autorizado || "";
                document.getElementById("telAutorizado").value = datos.telefono_autorizado || "";
            } else {
                console.error(response.data.message);
            }
        })
        .catch(error => {
            console.error("Error al cargar la inscripción:", error);
        });
}

/**
 * Marca el checkbox y muestra el campo de texto si hay datos.
 */
function marcarCheckbox(checkboxId, inputId, value) {
    const checkbox = document.getElementById(checkboxId);
    const inputField = document.getElementById(inputId);
    const fieldContainer = inputField.closest(".campo-adicional"); // Contenedor del campo

    if (value && value.trim() !== "") {
        checkbox.checked = true; // Marcar el checkbox
        inputField.value = value; // Rellenar campo
        fieldContainer.style.display = "block"; // Mostrar el campo
    } else {
        checkbox.checked = false;
        fieldContainer.style.display = "none"; // Ocultar campo si no hay datos
    }

    // Evento para mostrar u ocultar el campo cuando se interactúe con el checkbox
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            fieldContainer.style.display = "block";
        } else {
            fieldContainer.style.display = "none";
            inputField.value = ""; // Limpiar campo si se desmarca
        }
    });
}

// Evento para actualizar la inscripción
document.getElementById("btnActualizar").addEventListener("click", function (event) {
    event.preventDefault(); // Evitar recarga de la página

    const idInscripcion = new URLSearchParams(window.location.search).get("id_inscripcion");

    // Obtener valores del formulario
    const datosFormulario = {
        id_inscripcion: idInscripcion,
        alergias: document.getElementById("alergiaHijo").value.trim(),
        medicacion: document.getElementById("medicacionActual").value.trim(),
        datos_adicionales: document.getElementById("infoAdicionalHijo").value.trim(),
        nombre_autorizado: document.getElementById("nombreAutorizado").value.trim(),
        dni_autorizado: document.getElementById("dniAutorizado").value.trim(),
        tel_autorizado: document.getElementById("telAutorizado").value.trim()
    };

    // Enviar datos al backend
    axios.post('../../backend/cambiarDatosPadre/actualizarInscripcion.php', datosFormulario)
        .then(response => {
            if (response.data.success) {
                mostrarPopup("¡Datos actualizados correctamente!");
            } else {
                mostrarPopup("Error al actualizar los datos: " + response.data.message, true);
            }
        })
        .catch(error => {
            mostrarPopup("Error de conexión: " + error.message, true);
        });
});

// Función para mostrar un popup de éxito o error
function mostrarPopup(mensaje, error = false) {
    const popup = document.getElementById("popupConfirmacion");
    popup.querySelector("h3").innerText = error ? "Error" : "Datos Actualizados";
    popup.querySelector("p").innerText = mensaje;
    popup.style.display = "flex";

    // Si no hay error, configurar botón para cerrar y redirigir
    document.getElementById("btnPopupAceptar").onclick = function () {
        cerrarPopupExito(error);
    };
}

// Función para cerrar el popup y redirigir si fue exitoso
function cerrarPopupExito(error) {
    document.getElementById("popupConfirmacion").style.display = "none";
    if (!error) {
        window.location.href = "../cuentaPadre/cuentaPadre.html"; // Redirigir solo si no hubo error
    }
}

// Evento para eliminar la inscripción al confirmar
document.getElementById("btnConfirmarEliminar").addEventListener("click", function () {
    mostrarPopupEliminar(); // Llamar a la función para mostrar el popup
});

// Función para mostrar el popup de confirmación antes de eliminar
function mostrarPopupEliminar() {
    const popup = document.getElementById("popupEliminar");
    document.getElementById("confirmacionTexto").innerText = "¿Estás seguro de que deseas eliminar la inscripción?";
    popup.style.display = "flex"; // Mostrar el popup

    // Configurar botón de aceptar para llamar a `confirmarEliminar`
    document.getElementById("btnConfirmarEliminar").onclick = function () {
        confirmarEliminar();
    };
}

// Función para eliminar la inscripción
function confirmarEliminar() {
    const idInscripcion = new URLSearchParams(window.location.search).get("id_inscripcion");

    if (!idInscripcion) {
        console.error("Error: ID de inscripción no definido.");
        return;
    }

    axios.post('../../backend/cambiarDatosPadre/eliminarInscripcion.php', { id_inscripcion: idInscripcion })
        .then(response => {
            if (response.data.success) {
                cerrarPopupEliminar();
                window.location.href = "../cuentaPadre/cuentaPadre.html"; // Redirigir tras eliminar
            } else {
                mostrarPopupEliminar("Error al eliminar la inscripción: " + response.data.message, true);
            }
        })
        .catch(error => {
            mostrarPopupEliminar("Error de conexión: " + error.message, true);
        });
}

// Función para cerrar el popup sin eliminar
function cerrarPopupEliminar() {
    document.getElementById("popupEliminar").style.display = "none";
}
