document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('id'); // Obtener el ID del grupo desde la URL

    if (idGrupo) {
        // Estamos editando un grupo existente
        cargarDetallesGrupo(idGrupo);
    } else {
        // Estamos creando un nuevo grupo
        cargarMonitores(); // Cargar monitores para un nuevo grupo
    }
});

// Función para cargar los detalles del grupo
function cargarDetallesGrupo(idGrupo) {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_grupo.php', { id_grupo: idGrupo }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const grupo = response.data.grupo;
            document.getElementById('nombreGrupo').value = grupo.nombre;

            // Cargar monitores y niños asociados
            cargarMonitores(grupo.id_monitor);
            cargarNinos(grupo.id_grupo);
        } else {
            console.error("Error al obtener detalles del grupo:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener detalles del grupo:', error);
    });
}

// Función para cargar monitores
function cargarMonitores(idMonitorSeleccionado = null) {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'monitores' }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const selectMonitor = document.getElementById('selectMonitor');
            selectMonitor.innerHTML = '';

            response.data.monitores.forEach(monitor => {
                const option = document.createElement('option');
                option.value = monitor.id_monitor;
                option.textContent = `${monitor.nombre} ${monitor.apellidos}`;
                if (monitor.id_monitor === idMonitorSeleccionado) {
                    option.selected = true;
                }
                selectMonitor.appendChild(option);
            });
        } else {
            console.error("Error al obtener monitores:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener monitores:', error);
    });
}

// Función para cargar niños
function cargarNinos(idGrupo = null) {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'ninos', id_grupo: idGrupo }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const containerNinos = document.getElementById('ninoContainer');
            containerNinos.innerHTML = '<span class="add-button" onclick="showPopup(\'nino\')"><i class="fa-solid fa-plus"></i></span>';

            response.data.ninos.forEach(nino => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';
                tarjeta.setAttribute('data-id', nino.id_hijo);
                tarjeta.innerHTML = `
                    <span class="name">${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span class="icon delete" onclick="mostrarPopupConfirmacion(${nino.id_hijo}, '${nino.nombre} ${nino.apellidos}', 'nino')">
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>
                `;
                containerNinos.appendChild(tarjeta);
            });
        } else {
            console.error("Error al obtener niños:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener niños:', error);
    });
}

// Función para mostrar el popup de confirmación de eliminación
function mostrarPopupConfirmacion(id, nombre, tipo) {
    const popup = document.getElementById("popupConfirmacion");
    const confirmacionTexto = document.getElementById("confirmacionTexto");

    confirmacionTexto.textContent = `¿Estás seguro de que deseas eliminar a ${nombre}?`;
    popup.dataset.id = id;
    popup.dataset.tipo = tipo;

    popup.style.display = "flex";
}

// Función para confirmar la eliminación
function confirmarEliminacion() {
    const popup = document.getElementById("popupConfirmacion");
    const id = popup.dataset.id;
    const tipo = popup.dataset.tipo;

    const data = {
        accion: tipo === 'monitor' ? 'eliminar_monitor' : 'eliminar_nino',
        id: id
    };

    axios.post("/PequenosNavegantes/app/backend/admin/grupos/gestionar_grupo.php", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            closePopup();
            cargarDetallesGrupo(idGrupo);
        } else {
            alert("Error al eliminar.");
        }
    })
    .catch(error => {
        console.error("Error eliminando:", error);
    });
}

// Función para cerrar el popup
function closePopup() {
    const popup = document.getElementById("popupConfirmacion");
    popup.style.display = "none";
}

// Función para mostrar el popup de agregar monitor o niño
function showPopup(tipo) {
    const popup = tipo === 'monitor' ? document.getElementById('popupAddMonitor') : document.getElementById('popupAddChild');
    popup.style.display = "flex";
}

// Función para agregar un monitor
function agregarMonitor() {
    const selectMonitor = document.getElementById('selectMonitor');
    const idMonitor = selectMonitor.value;
    const nombreMonitor = selectMonitor.options[selectMonitor.selectedIndex].text;

    const monitorContainer = document.getElementById('monitorContainer');
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.setAttribute('data-id', idMonitor);
    tarjeta.innerHTML = `
        <span class="name">${nombreMonitor}</span>
        <div class="icons">
            <span class="icon delete" onclick="mostrarPopupConfirmacion(${idMonitor}, '${nombreMonitor}', 'monitor')">
                <i class="fa-solid fa-trash"></i>
            </span>
        </div>
    `;
    monitorContainer.appendChild(tarjeta);

    closePopup(); // Cerrar el popup después de agregar el monitor
}


// Función para cargar niños sin grupo en el <select> del popup
function cargarNinosEnSelect() {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'ninos' }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const selectNino = document.getElementById('selectNino');
            selectNino.innerHTML = '<option value="">Selecciona un niño</option>'; // Opción por defecto

            response.data.ninos.forEach(nino => {
                const option = document.createElement('option');
                option.value = nino.id_hijo;
                option.textContent = `${nino.nombre} ${nino.apellidos}`;
                selectNino.appendChild(option);
            });
        } else {
            console.error("Error al obtener niños:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener niños:', error);
    });
}

// Función para cargar niños asociados al grupo en el contenedor
function cargarNinosEnContenedor(idGrupo) {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'ninos', id_grupo: idGrupo }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const ninoContainer = document.getElementById('ninoContainer');
            ninoContainer.innerHTML = '<span class="add-button" onclick="showPopup(\'nino\')"><i class="fa-solid fa-plus"></i></span>';

            response.data.ninos.forEach(nino => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';
                tarjeta.setAttribute('data-id', nino.id_hijo);
                tarjeta.innerHTML = `
                    <span class="name">${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span class="icon delete" onclick="mostrarPopupConfirmacion(${nino.id_hijo}, '${nino.nombre} ${nino.apellidos}', 'nino')">
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>
                `;
                ninoContainer.appendChild(tarjeta);
            });
        } else {
            console.error("Error al obtener niños:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener niños:', error);
    });
}


// Función para mostrar el popup de agregar niño
function showPopup(tipo) {
    if (tipo === 'nino') {
        cargarNinosEnSelect(); // Cargar niños sin grupo en el <select> del popup
    }
    const popup = tipo === 'monitor' ? document.getElementById('popupAddMonitor') : document.getElementById('popupAddChild');
    popup.style.display = "flex";
}

// Función para agregar un niño al grupo
function agregarNino() {
    const selectNino = document.getElementById('selectNino');
    const idNino = selectNino.value; // Obtener el ID del niño seleccionado
    const nombreNino = selectNino.options[selectNino.selectedIndex].text; // Obtener el nombre del niño seleccionado

    if (!idNino) {
        alert("Por favor, selecciona un niño.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('id'); // Obtener el ID del grupo desde la URL

    if (!idGrupo) {
        alert("Error: No se ha proporcionado un ID de grupo.");
        return;
    }

    const data = {
        accion: 'agregar_nino',
        id_hijo: idNino,
        id_grupo: idGrupo
    };

    // Enviar la solicitud al backend para asociar el niño al grupo
    axios.post("/PequenosNavegantes/app/backend/admin/grupos/gestionar_grupo.php", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            // Añadir solo el niño seleccionado al contenedor
            const ninoContainer = document.getElementById('ninoContainer');
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta';
            tarjeta.setAttribute('data-id', idNino);
            tarjeta.innerHTML = `
                <span class="name">${nombreNino}</span>
                <div class="icons">
                    <span class="icon delete" onclick="mostrarPopupConfirmacion(${idNino}, '${nombreNino}', 'nino')">
                        <i class="fa-solid fa-trash"></i>
                    </span>
                </div>
            `;
            ninoContainer.appendChild(tarjeta);

            closePopup(); // Cerrar el popup
        } else {
            alert("Error al agregar el niño: " + response.data.message);
        }
    })
    .catch(error => {
        console.error("Error agregando niño:", error);
        alert("Error al agregar el niño. Por favor, intenta de nuevo.");
    });
}

// Función para guardar el grupo
function guardarGrupo() {
    const nombreGrupo = document.getElementById('nombreGrupo').value;
    const idMonitor = document.querySelector('#monitorContainer .tarjeta')?.getAttribute('data-id');

    if (!nombreGrupo || !idMonitor) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('id'); // Obtener el ID del grupo desde la URL (si existe)

    const data = {
        accion: 'guardar_grupo',
        id_grupo: idGrupo, // Puede ser null si es un nuevo grupo
        nombre: nombreGrupo,
        id_monitor: idMonitor
    };

    // Guardar el grupo en la base de datos
    axios.post("/PequenosNavegantes/app/backend/admin/grupos/gestionar_grupo.php", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const nuevoIdGrupo = response.data.id_grupo; // Obtener el ID del grupo creado
            alert("Grupo guardado correctamente.");

            if (!idGrupo) {
                // Redirigir a la página de edición del grupo con el ID generado
                window.location.href = `detallesGrupo.html?id=${nuevoIdGrupo}`;
            } else {
                // Recargar la página para actualizar los datos
                window.location.reload();
            }
        } else {
            alert("Error al guardar el grupo: " + response.data.message);
        }
    })
    .catch(error => {
        console.error("Error guardando grupo:", error);
        alert("Error al guardar el grupo. Por favor, intenta de nuevo.");
    });
}

function closePopup() {
    const popups = document.querySelectorAll(".popup-container");
    popups.forEach(popup => popup.style.display = "none");
}
