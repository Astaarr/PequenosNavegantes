document.addEventListener("DOMContentLoaded", function() {
    currentDate = new Date();
    crearCalendario();
});

let currentDate;

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

    for (let i = 0; i < primerDiaSemana; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty';
        diasContenedor.appendChild(emptyDiv);
    }

    for(let i = 1; i <= diasEnMes; i++) {
        const diaElemento = document.createElement('div');
        diaElemento.className = 'day';
        diaElemento.textContent = i;
        
        const hoy = new Date();
        if(i === hoy.getDate() && 
           currentDate.getMonth() === hoy.getMonth() &&
           currentDate.getFullYear() === hoy.getFullYear()) {
            diaElemento.classList.add('hoy');
        }
        
        diasContenedor.appendChild(diaElemento);

        const fecha = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        cargarActividadesDia(diaElemento, fecha);

        diaElemento.addEventListener("click", function() {
            abrirDetalles(fecha);
        });
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    crearCalendario();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    crearCalendario();
}

function cargarActividadesDia(diaElemento, fecha) {
    axios.get(`../../backend/admin/programacion/getProgramacion.php?fecha=${fecha}`)
    .then(respuesta => {
        if(respuesta.data.length > 0) {
            const listaActividades = document.createElement('div');
            listaActividades.className = 'eventos';
            
            respuesta.data.forEach(actividad => {
                const actividadElemento = document.createElement('div');
                actividadElemento.className = 'evento';
                actividadElemento.textContent = `${actividad.hora_inicio} - ${actividad.nombre_actividad}`;
                listaActividades.appendChild(actividadElemento);
            });
            
            diaElemento.appendChild(listaActividades);
        }
    });
}



function abrirDetalles(fecha) {
    window.location.href = `../monitorActividadesDia/monitorActividadesDia.html?fecha=${fecha}`;
}