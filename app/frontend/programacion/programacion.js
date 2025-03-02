/*---------- CALENDARIO ----------*/


function obtenerParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}

document.addEventListener("DOMContentLoaded", function() {
    currentDate = new Date();
    const fechaParam = obtenerParametroURL("fecha");

    if (fechaParam) {
        fechaSeleccionada = fechaParam;
        const [año, mes, dia] = fechaParam.split('-').map(Number);
        currentDate.setFullYear(año, mes - 1, 1);
    }

    crearCalendario();
    cargarSelects();
});


let currentDate;
let fechaSeleccionada = null;



function crearCalendario() {
    const diasContenedor = document.getElementById('calendar-days');
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                   'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    
    document.getElementById('month-year').textContent = 
        `${meses[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    diasContenedor.innerHTML = '';
    
    const primerDia = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const ultimoDia = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    let primerDiaSemana = primerDia.getDay();
    primerDiaSemana = (primerDiaSemana === 0) ? 6 : primerDiaSemana - 1;
    
    // Crear celdas vacías para alinear el primer día de la semana
    for (let i = 0; i < primerDiaSemana; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty';
        diasContenedor.appendChild(emptyDiv);
    }
    
    // Crear cada día del mes
    for(let i = 1; i <= diasEnMes; i++) {
        const diaElemento = document.createElement('div');
        // Se asigna por defecto la clase sinActividad
        diaElemento.className = 'day sinActividad';
        diaElemento.textContent = i;
        
        const fechaActual = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        diaElemento.setAttribute("data-fecha", fechaActual);
        
        if (fechaSeleccionada === fechaActual) {
            diaElemento.classList.add('selected');
            cargarActividadesDia();
        }
        
        diaElemento.addEventListener('click', function() {
            seleccionarDia(this, i);
        });
        
        diasContenedor.appendChild(diaElemento);
        
        // Verifica si el día tiene actividad y, en ese caso, quita la clase sinActividad
        checkActividadDia(fechaActual, diaElemento);
    }
}


function checkActividadDia(fecha, diaElemento) {
    axios.get(`../../backend/admin/programacion/getProgramacion.php?fecha=${fecha}`)
    .then(respuesta => {
        if (respuesta.data.length > 0) {
            // Si hay actividades, se quita la clase sinActividad
            diaElemento.classList.remove("sinActividad");
        }
    })
    .catch(error => {
        console.error(`Error al comprobar la actividad para ${fecha}:`, error);
    });
}

function seleccionarDia(elemento, dia) {
    document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
    elemento.classList.add('selected');
    
    const mes = currentDate.getMonth() + 1;
    const año = currentDate.getFullYear();
    fechaSeleccionada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    

    // Si no hay días seleccionados muestro un mensaje de info
    const contenedor = document.getElementById('groupContainer');
    
    if(!fechaSeleccionada) {
        contenedor.innerHTML = '<div class="mensaje-info">Selecciona un día primero</div>';
        return;
    }

    cargarActividadesDia();
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    crearCalendario();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    crearCalendario();
}






/*---------- CARGAR DATOS ----------*/
function cargarSelects() {
    // Cargar actividades
    axios.get('../../backend/admin/programacion/getActividades.php')
    .then(respuesta => {
        const select = document.getElementById('listaActividades');
        select.innerHTML = '<option value="">Selecciona Actividad</option>';
        respuesta.data.forEach(actividad => {
            select.innerHTML += `<option value="${actividad.id_actividad}">${actividad.nombre}</option>`;
        });
    });
    
    // Cargar grupos
    axios.get('../../backend/admin/programacion/getGrupos.php')
    .then(respuesta => {
        const select = document.getElementById('listaGrupos');
        select.innerHTML = '<option value="">Selecciona Grupo</option>';
        respuesta.data.forEach(grupo => {
            select.innerHTML += `<option value="${grupo.id_grupo}">${grupo.nombre}</option>`;
        });
    });
}

/*---------- MOSTRAR ACTIVIDADES ----------*/
function cargarActividadesDia() {
    const contenedor = document.getElementById('groupContainer');
    
    if (!fechaSeleccionada) {
        contenedor.innerHTML = '<div class="mensaje-info">Selecciona un día primero</div>';
        return;
    }

    axios.get(`../../backend/admin/programacion/getProgramacion.php?fecha=${fechaSeleccionada}`)
    .then(respuesta => {
        // Buscamos el elemento del día en el calendario mediante el atributo data-fecha
        const diaElemento = document.querySelector(`.day[data-fecha="${fechaSeleccionada}"]`);
        
        if (respuesta.data.length === 0) {
            contenedor.innerHTML = '<div class="mensaje-info">No se han añadido actividades para este día</div>';
            // Aseguramos que el día mantenga la clase sinActividad
            if(diaElemento) {
                diaElemento.classList.add("sinActividad");
            }
            return;
        }
        
        // Si hay actividades, quitamos la clase sinActividad para cambiar el color
        if(diaElemento) {
            diaElemento.classList.remove("sinActividad");
        }
        
        contenedor.innerHTML = '';
        respuesta.data.forEach(actividad => {
            contenedor.innerHTML += `
                <div class="tarjeta programacion">
                    <div class="campo">
                        <i class="fa-solid fa-clock"></i>
                        <div class="hora">${actividad.hora_inicio}</div>
                    </div>
                    <div class="campo moreInfo">
                        <div class="actividad">${actividad.nombre_actividad}</div>
                        <div class="grupo">${actividad.nombre_grupo}</div>
                    </div>
                    <div class="campo moreInfo">
                        <div class="duracion">${actividad.duracion} mins</div>
                        <div class="lugar">${actividad.lugar}</div>
                    </div>
                    <span class="eliminar" onclick="mostrarPopupEliminar(${actividad.id_programacion})">
                        <i class="fa-solid fa-trash"></i>
                    </span>
                </div>
            `;
        });
    });
}





/*---------- FORMULARIO ----------*/
document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();
    const errorElement = document.getElementById('errorGeneral');
    errorElement.textContent = '';
    
    // Validar campos
    const camposRequeridos = {
        horaInicio: document.getElementById('horaInicio').value,
        duracion: document.getElementById('duracion').value,
        lugar: document.getElementById('lugar').value.trim(),
        listaActividades: document.getElementById('listaActividades').value,
        listaGrupos: document.getElementById('listaGrupos').value
    };

    const camposVacios = Object.entries(camposRequeridos)
        .filter(([_, valor]) => !valor)
        .map(([nombre]) => nombre);

    if(camposVacios.length > 0 || !fechaSeleccionada) {
        errorElement.style.display = 'block';
        errorElement.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Rellena todos los campos primero`;
        return;
    }

    // Enviar datos
    const datos = {
        fecha: fechaSeleccionada,
        hora_inicio: camposRequeridos.horaInicio,
        duracion: camposRequeridos.duracion,
        lugar: camposRequeridos.lugar,
        id_actividad: camposRequeridos.listaActividades,
        id_grupo: camposRequeridos.listaGrupos
    };

    axios.post('../../backend/admin/programacion/crearProgramacion.php', datos)
    .then(() => {
        this.reset();
        cargarActividadesDia();
        document.getElementById('popupActividadAgregada').style.display = 'flex';
    })
    .catch(error => {
        errorElement.textContent = 'Error al guardar: ' + error.message;
    });
});

// Función para cerrar el popup de actividad agregada
function cerrarPopupActividad() {
    document.getElementById('popupActividadAgregada').style.display = 'none';
}

/*---------- ELIMINAR ----------*/
function mostrarPopupEliminar(id) {
    actividadParaEliminar = id;
    document.getElementById('popupConfirmacion').style.display = 'flex';
}

function confirmarEliminacion() {
    axios.post('../../backend/admin/programacion/eliminarProgramacion.php', { id: actividadParaEliminar })
    .then(() => {
        cargarActividadesDia();
        cerrarPopup();
    })
    .catch(error => {
        console.error('Error eliminando:', error);
    });
}

function cerrarPopup() {
    document.getElementById('popupConfirmacion').style.display = 'none';
    actividadParaEliminar = null;
}