document.addEventListener("DOMContentLoaded", function() {
    // Inicializar calendario y cargar datos
    crearCalendario();
    cargarSelects();
    cargarActividadesDia();
});

// Variables globales básicas
let fechaSeleccionada = null;
let actividadParaEliminar = null;

/*---------- CALENDARIO ----------*/
function crearCalendario() {
    const dias = document.getElementById('calendar-days');
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const hoy = new Date();
    
    // Mostrar mes y año actual
    document.getElementById('month-year').textContent = 
        `${meses[hoy.getMonth()]} ${hoy.getFullYear()}`;

    // Crear días del mes
    for(let i = 1; i <= 31; i++) {
        const dia = document.createElement('div');
        dia.className = 'day';
        dia.textContent = i;
        
        // Marcar día actual
        if(i === hoy.getDate()) {
            dia.classList.add('hoy');
        }
        
        // Seleccionar día
        dia.addEventListener('click', function() {
            seleccionarDia(this, i);
        });
        
        dias.appendChild(dia);
    }
}

function seleccionarDia(elemento, dia) {
    // Quitar selección anterior
    document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
    
    // Marcar nuevo día seleccionado
    elemento.classList.add('selected');
    const mesActual = new Date().getMonth() + 1;
    fechaSeleccionada = `${new Date().getFullYear()}-${mesActual}-${dia}`;
    
    cargarActividadesDia();
}

/*---------- CARGAR DATOS ----------*/
function cargarSelects() {
    // Cargar actividades
    axios.get('../../backend/admin/programacion/getActividades.php')
    .then(respuesta => {
        const select = document.getElementById('listaActividades');
        respuesta.data.forEach(actividad => {
            select.innerHTML += `<option value="${actividad.id_actividad}">${actividad.nombre}</option>`;
        });
    });
    
    // Cargar grupos
    axios.get('../../backend/admin/programacion/getGrupos.php')
    .then(respuesta => {
        const select = document.getElementById('listaGrupos');
        respuesta.data.forEach(grupo => {
            select.innerHTML += `<option value="${grupo.id_grupo}">${grupo.nombre}</option>`;
        });
    });
}

/*---------- MOSTRAR ACTIVIDADES ----------*/
function cargarActividadesDia() {
    if(!fechaSeleccionada) return;

    axios.get(`../../backend/admin/programacion/getProgramacion.php?fecha=${fechaSeleccionada}`)
    .then(respuesta => {
        const contenedor = document.getElementById('groupContainer');
        contenedor.innerHTML = ''; // Limpiar contenido
        
        respuesta.data.forEach(actividad => {
            contenedor.innerHTML += `
                <div class="tarjeta programacion">
                    <div class="hora">${actividad.hora_inicio}</div>
                    <div class="duracion">${actividad.duracion} mins</div>
                    <div class="lugar">${actividad.lugar}</div>
                    <div class="actividad">${actividad.nombre_actividad}</div>
                    <div class="grupo">${actividad.nombre_grupo}</div>
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
    
    // Obtener valores
    const datos = {
        fecha: fechaSeleccionada,
        hora_inicio: document.getElementById('horaInicio').value,
        duracion: document.getElementById('duracion').value,
        lugar: document.getElementById('lugar').value,
        id_actividad: document.getElementById('listaActividades').value,
        id_grupo: document.getElementById('listaGrupos').value
    };
    
    // Validación simple
    if(Object.values(datos).some(valor => !valor)) {
        alert('¡Completa todos los campos!');
        return;
    }
    
    // Enviar datos
    axios.post('../../backend/admin/programacion/crearProgramacion.php', datos)
    .then(() => {
        cargarActividadesDia();
        this.reset(); // Limpiar formulario
    })
    .catch(error => alert('Error al guardar: ' + error));
});

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
    });
}

function cerrarPopup() {
    document.getElementById('popupConfirmacion').style.display = 'none';
    actividadParaEliminar = null;
}