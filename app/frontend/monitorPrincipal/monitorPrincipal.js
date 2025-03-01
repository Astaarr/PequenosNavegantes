document.addEventListener("DOMContentLoaded", function() {
    currentDate = new Date();
    crearCalendario();
});

let currentDate;
const idMonitor = 2; // Obtener de variable de sesión o localStorage

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
        cargarActividadesMonitor(diaElemento, fecha);

        diaElemento.addEventListener("click", function() {
            window.location.href = `../monitorActividadesDia/monitorActividadesDia.html?fecha=${fecha}&monitor=${idMonitor}`;
        });
    }
}

function cargarActividadesMonitor(diaElemento, fecha) {
    axios.get(`../../backend/monitor/getActividadesMonitor.php?fecha=${fecha}&id_monitor=${idMonitor}`)
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

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    crearCalendario();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    crearCalendario();
}