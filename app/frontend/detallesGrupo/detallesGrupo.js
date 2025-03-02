document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('id'); // Obtener el ID del grupo desde la URL

    if (idGrupo) {
        // Estamos editando un grupo existente
        cargarDetallesGrupo(idGrupo);
    } else {
        // Estamos creando un nuevo grupo: Cargar solo monitores libres
        cargarMonitoresLibres(); 
    }
});

// Función para cargar los detalles del grupo
function cargarDetallesGrupo(idGrupo) {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_grupo.php', { id_grupo: idGrupo }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            const grupo = response.data.grupo;
            document.getElementById('nombreGrupo').value = grupo.nombre;

            // Cargar monitores y niños asociados
            cargarMonitorSeleccionado(grupo.id_monitor);
            cargarNinos(grupo.id_grupo);
        } else {
            console.error("Error al obtener detalles del grupo:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener detalles del grupo:', error);
    });
}

// Función para cargar monitores libres (sin grupo asignado)
function cargarMonitoresLibres() {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'monitores_libres' }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            const selectMonitor = document.getElementById('selectMonitor');
            const monitorContainer = document.getElementById('monitorContainer');

            selectMonitor.innerHTML = '<option value="">Selecciona un monitor</option>';
            monitorContainer.innerHTML = '<span class="add-button" onclick="showPopup(\'monitor\')"><i class="fa-solid fa-plus"></i></span>';

            response.data.monitores.forEach(monitor => {
                const option = document.createElement('option');
                option.value = monitor.id_monitor;
                option.textContent = `${monitor.nombre} ${monitor.apellidos}`;
                selectMonitor.appendChild(option);
            });
        } else {
            console.warn("No hay monitores disponibles para asignar.");
        }
    })
    .catch(error => console.error('Error al obtener monitores libres:', error));
}

// Función para cargar el monitor seleccionado (cuando se edita un grupo)
function cargarMonitorSeleccionado(idMonitorSeleccionado) {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'monitores' }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            const selectMonitor = document.getElementById('selectMonitor');
            const monitorContainer = document.getElementById('monitorContainer');

            selectMonitor.innerHTML = '<option value="">Selecciona un monitor</option>';
            monitorContainer.innerHTML = '<span class="add-button" onclick="showPopup(\'monitor\')"><i class="fa-solid fa-plus"></i></span>';

            response.data.monitores.forEach(monitor => {
                const option = document.createElement('option');
                option.value = monitor.id_monitor;
                option.textContent = `${monitor.nombre} ${monitor.apellidos}`;

                // Marcar como seleccionado si coincide
                if (parseInt(monitor.id_monitor) === parseInt(idMonitorSeleccionado)) {
                    option.selected = true;
                    mostrarMonitorEnContenedor(monitor);
                }

                selectMonitor.appendChild(option);
            });
        } else {
            console.warn("Error al obtener los monitores.");
        }
    })
    .catch(error => console.error('Error al obtener monitores:', error));
}

// Función para mostrar el monitor seleccionado en pantalla
function mostrarMonitorEnContenedor(monitor) {
    const monitorContainer = document.getElementById('monitorContainer');

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.setAttribute('data-id', monitor.id_monitor);
    tarjeta.innerHTML = `
        <span class="name">${monitor.nombre} ${monitor.apellidos}</span>
        <div class="icons">
            <span class="icon delete" onclick="mostrarPopupConfirmacion(${monitor.id_monitor}, '${monitor.nombre} ${monitor.apellidos}', 'monitor')">
                <i class="fa-solid fa-trash"></i>
            </span>
        </div>
    `;

    monitorContainer.appendChild(tarjeta);
}

// Función para cargar niños asociados al grupo
function cargarNinos(idGrupo = null) {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'ninos', id_grupo: idGrupo }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            const containerNinos = document.getElementById('ninoContainer');
            containerNinos.innerHTML = '<span class="add-button" onclick="showPopup(\'nino\')"><i class="fa-solid fa-plus"></i></span>';

            // **Limpiar el array de niños antes de llenarlo con los datos de la base de datos**
            ninosTemporales = [];

            response.data.ninos.forEach(nino => {
                // **Agregar niños existentes al array temporal**
                ninosTemporales.push({ id_hijo: nino.id_hijo, nombre: `${nino.nombre} ${nino.apellidos}` });

                // **Crear la tarjeta visual**
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';
                tarjeta.setAttribute('data-id', nino.id_hijo);
                tarjeta.innerHTML = `
                    <span class="name">${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span class="icon delete" onclick="eliminarNinoTemporal(${nino.id_hijo}, '${nino.nombre} ${nino.apellidos}')">
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>
                `;
                containerNinos.appendChild(tarjeta);
            });

            console.log("Niños cargados desde la base de datos:", ninosTemporales);

            // **Actualizar contador después de llenar `ninosTemporales`**
            actualizarContadorNinos();

        } else {
            console.warn("No hay niños en este grupo.");
        }
    })
    .catch(error => console.error('Error al obtener niños:', error));
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
            closePopup(); // Cerrar el popup correctamente
            
            // Eliminar el elemento de la interfaz sin recargar
            if (tipo === 'monitor') {
                document.querySelector(`#monitorContainer .tarjeta[data-id="${id}"]`).remove();
            } else if (tipo === 'nino') {
                document.querySelector(`#ninoContainer .tarjeta[data-id="${id}"]`).remove();
            }
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

    if (!idMonitor) {
        mostrarPopupError("Por favor, selecciona un monitor válido.");
        return;
    }

    const monitorContainer = document.getElementById('monitorContainer');

    // Eliminar cualquier monitor existente antes de agregar uno nuevo
    const tarjetaExistente = monitorContainer.querySelector('.tarjeta');
    if (tarjetaExistente) {
        tarjetaExistente.remove();
    }

    // Crear la tarjeta del monitor seleccionado
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.setAttribute('data-id', idMonitor);
    tarjeta.innerHTML = `
        <span class="name">${nombreMonitor}</span>
        <div class="icons">
            <span class="icon delete" onclick="eliminarMonitor(${idMonitor}, '${nombreMonitor}')">
                <i class="fa-solid fa-trash"></i>
            </span>
        </div>
    `;
    
    monitorContainer.appendChild(tarjeta);

    closePopup(); // Cerrar el popup después de agregar el monitor
}


function eliminarMonitor(idMonitor, nombreMonitor) {
    const selectMonitor = document.getElementById('selectMonitor');
    const monitorContainer = document.getElementById('monitorContainer');

    // Habilitar el select para permitir añadir otro monitor
    agregarMonitor.classList.remove('hidden');


    // Eliminar la tarjeta visual
    monitorContainer.innerHTML = '';
}


// Función para cargar niños sin grupo en el <select> del popup
function cargarNinosEnSelect() {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_datos.php', { tipo: 'ninos' }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            const selectNino = document.getElementById('selectNino');

            selectNino.innerHTML = '<option value="">Selecciona un niño</option>'; 

            response.data.ninos.forEach(nino => {
                // Verificar si el niño ya está en el grupo
                if (!ninosTemporales.some(n => n.id_hijo === nino.id_hijo)) {
                    const option = document.createElement('option');
                    option.value = nino.id_hijo;
                    option.textContent = `${nino.nombre} ${nino.apellidos}`;
                    selectNino.appendChild(option);
                }
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
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            const ninoContainer = document.getElementById('ninoContainer');
            const addButton = document.querySelector(".add-button");

            // **Vaciar el array de niños temporales antes de llenarlo**
            ninosTemporales = [];

            // **Vaciar el contenedor visual**
            ninoContainer.innerHTML = '<span class="add-button" onclick="showPopup(\'nino\')"><i class="fa-solid fa-plus"></i></span>';

            response.data.ninos.forEach(nino => {
                // **Agregar niños existentes al array temporal**
                let nuevoNino = { id_hijo: nino.id_hijo, nombre: `${nino.nombre} ${nino.apellidos}` };
                ninosTemporales.push(nuevoNino);

                // **Crear la tarjeta visual**
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';
                tarjeta.setAttribute('data-id', nino.id_hijo);
                tarjeta.innerHTML = `
                    <span class="name">${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span class="icon delete" onclick="eliminarNinoTemporal(${nino.id_hijo}, '${nino.nombre} ${nino.apellidos}')">
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>
                `;
                ninoContainer.appendChild(tarjeta);
            });

            console.log("Niños cargados desde la base de datos:", ninosTemporales);

            // **Actualizar contador de niños**
            actualizarContadorNinos();
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

let ninosTemporales = [];

function agregarNino() {
    const selectNino = document.getElementById('selectNino');
    const idNino = selectNino.value;
    const nombreNino = selectNino.options[selectNino.selectedIndex].text;
    const addButton = document.querySelector(".add-button");

    if (!idNino) {
        mostrarPopupError("Por favor, selecciona un niño.");
        return;
    }

    if (ninosTemporales.length >= 10) {
        mostrarPopupError("No puedes añadir más de 10 niños a un grupo.");
        return;
    }

    ninosTemporales.push({ id_hijo: idNino, nombre: nombreNino });

    selectNino.remove(selectNino.selectedIndex);

    const ninoContainer = document.getElementById('ninoContainer');
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.setAttribute('data-id', idNino);
    tarjeta.innerHTML = `
        <span class="name">${nombreNino}</span>
        <div class="icons">
            <span class="icon delete" onclick="eliminarNinoTemporal(${idNino}, '${nombreNino}')">
                <i class="fa-solid fa-trash"></i>
            </span>
        </div>
    `;
    ninoContainer.appendChild(tarjeta);

    closePopup();

    actualizarContadorNinos();
}








function eliminarNinoTemporal(idNino, nombreNino) {
    const addButton = document.querySelector(".add-button");

    ninosTemporales = ninosTemporales.filter(n => n.id_hijo !== idNino);

    document.querySelector(`#ninoContainer .tarjeta[data-id="${idNino}"]`).remove();

    const selectNino = document.getElementById('selectNino');
    const option = document.createElement('option');
    option.value = idNino;
    option.textContent = nombreNino;
    selectNino.appendChild(option);

    actualizarContadorNinos();
}






function guardarGrupo() {
    const nombreGrupo = document.getElementById('nombreGrupo').value;
    const idMonitor = document.querySelector('#monitorContainer .tarjeta')?.getAttribute('data-id');

    const camposRequeridos = {
        nombreGrupo: nombreGrupo,
        idMonitor: idMonitor
    };

    const camposVacios = Object.entries(camposRequeridos)
        .filter(([_, valor]) => !valor)
        .map(([nombre]) => nombre);

    if (camposVacios.length > 0) {
        errorGeneral.style.display = 'block';
        errorGeneral.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Rellena todos los campos primero`;
        return;
    }


    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('id');

    const data = {
        accion: 'guardar_grupo',
        id_grupo: idGrupo,
        nombre: nombreGrupo,
        id_monitor: idMonitor,
        ninos: ninosTemporales // Enviar todos los niños temporales
    };

    axios.post("/PequenosNavegantes/app/backend/admin/grupos/gestionar_grupo.php", JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            mostrarPopupExito("El grupo se ha guardado correctamente."); 
        }
    })
    .catch(error => console.error("Error guardando grupo:", error));
}

function actualizarContadorNinos() {
    const contador = document.getElementById("contadorNinos");
    const addButton = document.querySelector(".add-button");
    const totalNinos = ninosTemporales.length; // **Contar correctamente los niños**

    // **Actualizar el contador en pantalla**
    contador.textContent = `(${totalNinos}/10)`;

    // **Si hay 10 niños, ocultar el botón `+`**
    if (totalNinos >= 10) {
        addButton.style.display = "none";
    } else {
        addButton.style.display = "inline-block";
    }
}



function mostrarPopupError(mensaje) {
    const popup = document.getElementById("popupError");
    const mensajeError = document.getElementById("mensajeError");

    mensajeError.textContent = mensaje;
    popup.style.display = "flex";
}

function mostrarPopupExito(mensaje) {
    const popup = document.getElementById("popupExito");
    const mensajeExito = document.getElementById("mensajeExito");

    mensajeExito.textContent = mensaje;
    popup.style.display = "flex";
}

// Función para cerrar el popup de éxito
function cerrarPopupExito() {
    document.getElementById("popupExito").style.display = "none";
    window.location.href = '../listadoGrupos/listadoGrupos.html'; 
}


// Función para cerrar el popup de error
function cerrarPopupError() {
    document.getElementById("popupError").style.display = "none";
}


function closePopup() {
    const popups = document.querySelectorAll(".popup-container");
    popups.forEach(popup => popup.style.display = "none");
}