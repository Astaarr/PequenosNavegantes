document.addEventListener("DOMContentLoaded", function() {
    currentDate = new Date();
    crearCalendario();

    // Obtener el ID del monitor desde la sesión
    axios.post("../../backend/monitor/nombreMonitor.php", {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (response.data.success) {
            const btnMonitor = document.getElementById("btnMonitor");
            btnMonitor.textContent = response.data.nombre;
            crearCalendario(); // Recargar calendario con el monitor correcto
        } else {
            console.error("No se pudo obtener el ID del monitor.");
        }
    })
    .catch(error => {
        console.error("Error verificando sesión del monitor:", error);
    });
});

let currentDate;

function crearCalendario() {
    const diasContenedor = document.getElementById('calendar-days');
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                   'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
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

    for (let i = 1; i <= diasEnMes; i++) {
        const diaElemento = document.createElement('div');
        diaElemento.className = 'day';
        diaElemento.textContent = i;

        const hoy = new Date();
        if (i === hoy.getDate() &&
            currentDate.getMonth() === hoy.getMonth() &&
            currentDate.getFullYear() === hoy.getFullYear()) {
            diaElemento.classList.add('hoy');
        }

        diasContenedor.appendChild(diaElemento);

        const fecha = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        cargarActividadesMonitor(diaElemento, fecha);

        diaElemento.addEventListener("click", function() {
            axios.post("../../backend/monitor/setSessionFecha.php", { fecha }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                if (response.data.success) {
                    window.location.href = "../monitorActividadesDia/monitorActividadesDia.html";
                } else {
                    console.error("No se pudo establecer la fecha en sesión.");
                }
            })
            .catch(error => {
                console.error("Error estableciendo la fecha en sesión:", error);
            });
        });
    }
}
function cargarActividadesMonitor(diaElemento, fecha) {
    axios.post("../../backend/monitor/getActividadesMonitor.php", { fecha }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(respuesta => {
        console.log(`📅 Respuesta para ${fecha}:`, respuesta.data);

        if (respuesta.data.success && respuesta.data.actividades.length > 0) {
            console.log(`✅ Actividad encontrada para ${fecha}:`, respuesta.data.actividades);

            // 1️⃣ Agregar la clase `.eventos` para que el CSS reconozca que este día tiene actividad
            diaElemento.classList.add("eventos");

            // 2️⃣ Agregar un punto visual para indicar actividad
            const indicador = document.createElement("div");
            indicador.className = "indicador-actividad";
            diaElemento.appendChild(indicador);

            // 3️⃣ Mostrar todas las actividades en el día
            respuesta.data.actividades.forEach(actividad => {
                const actividadInfo = document.createElement("p");
                actividadInfo.className = "nombre-actividad";
                actividadInfo.textContent = `${actividad.hora_inicio} - ${actividad.nombre_actividad}`;
                diaElemento.appendChild(actividadInfo);
            });

        } else {
            console.log(`❌ No hay actividades para la fecha ${fecha}, no se agregará marcador.`);
        }
    })
    .catch(error => {
        console.error("❌ Error cargando actividades:", error);
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

// Cerrar Sesión
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
