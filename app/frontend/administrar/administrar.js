document.addEventListener("DOMContentLoaded", function() {
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

// Funcion cerrar Sesion
function cerrarSesion() {
    axios.post('../../backend/login/logout.php')
        .then(response => {
            if (response.data.success) {
                window.location.href = '../index.html'; 
            } else {
                alert('Error al cerrar sesión.');
            }
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
        });
}



function abrirDetalles(fecha) {
    window.location.href = `../programacion/programacion.html?fecha=${fecha}`;
}