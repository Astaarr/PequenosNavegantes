document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID del grupo de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('id');

    if (idGrupo) {
        // Cargar detalles del grupo si estamos editando
        cargarDetallesGrupo(idGrupo);
    } else {
        // Inicializar para un nuevo grupo
        cargarMonitores();
        cargarNinos();
    }
});

// Función para cargar los detalles del grupo
function cargarDetallesGrupo(idGrupo) {
    axios.post('/PequenosNavegantes/app/backend/admin/obtener_grupo.php', { id_grupo: idGrupo }, {
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
    axios.post('/PequenosNavegantes/app/backend/admin/obtener_datos.php', { tipo: 'monitores' }, {
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
    axios.post('/PequenosNavegantes/app/backend/admin/obtener_datos.php', { tipo: 'ninos', id_grupo: idGrupo }, {
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

    axios.post("/PequenosNavegantes/app/backend/admin/gestionar_grupo.php", JSON.stringify(data), {
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


// Función para agregar un niño
function agregarNino() {
    const selectNino = document.getElementById('selectNino');
    const idNino = selectNino.value;
    const nombreNino = selectNino.options[selectNino.selectedIndex].text;

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

    closePopup(); // Cerrar el popup después de agregar el niño
}

// Función para guardar el grupo
function guardarGrupo() {
    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('id');

    const nombreGrupo = document.getElementById('nombreGrupo').value;
    const idMonitor = document.querySelector('#monitorContainer .tarjeta')?.getAttribute('data-id');

    const data = {
        accion: 'guardar_grupo',
        id_grupo: idGrupo,
        nombre: nombreGrupo,
        id_monitor: idMonitor
    };

    axios.post("/PequenosNavegantes/app/backend/admin/gestionar_grupo.php", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            window.location.href = "listadoGrupos.html";
        } else {
            alert("Error al guardar el grupo.");
        }
    })
    .catch(error => {
        console.error("Error guardando grupo:", error);
    });
}

function closePopup() {
    const popups = document.querySelectorAll(".popup-container");
    popups.forEach(popup => popup.style.display = "none");
}
