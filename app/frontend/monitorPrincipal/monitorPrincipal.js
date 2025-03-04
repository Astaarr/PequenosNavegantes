document.addEventListener("DOMContentLoaded", function() {
    axios.get('../../backend/authMonitor.php', { withCredentials: true })
    .then(response => {
        if (!response.data.auth) {
            window.location.href = "../loginMonitor/loginMonitor.html";
        }
    })
    .catch(error => {
        console.error("Error verificando sesión:", error);
        // En caso de error, redirige también para evitar accesos no deseados
        window.location.href = "../loginMonitor/loginMonitor.html";
    });
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


function cargarActividadesMonitor(diaElemento, fecha) {
    axios.post("../../backend/monitor/getActividadesMonitor.php", { fecha }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(respuesta => {
        console.log(`📅 Respuesta de actividades para ${fecha}:`, respuesta.data);

        if (respuesta.data.success && respuesta.data.actividades.length > 0) {
            diaElemento.classList.add("actividad-presente");

            let indicadorExistente = diaElemento.querySelector(".indicador-actividad");
            if (!indicadorExistente) {
                const indicador = document.createElement("div");
                indicador.className = "indicador-actividad";
                diaElemento.appendChild(indicador);
            }

            diaElemento.querySelectorAll(".nombre-actividad").forEach(el => el.remove());

            respuesta.data.actividades.forEach(actividad => {
                const actividadNombre = document.createElement("p");
                actividadNombre.className = "nombre-actividad";
                actividadNombre.textContent = `${actividad.hora_inicio} - ${actividad.nombre_actividad}`;
                diaElemento.appendChild(actividadNombre);
            });

            // 🚀 Agregar console.log para verificar la URL antes de redirigir
            diaElemento.onclick = () => {
                const urlDestino = `../monitorActividadesDia/monitorActividadesDia.html?fecha=${fecha}`;
                console.log("🔗 Redirigiendo a:", urlDestino);
                window.location.href = urlDestino;
            };
        }
    })
    .catch(error => {
        console.error(`❌ Error cargando actividades para ${fecha}:`, error);
    });
}






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
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const fecha = params.get('fecha');

    if (!fecha) {
        console.error("❌ No se recibió ninguna fecha.");
        return;
    }

    document.getElementById('diaMes').textContent = fecha;

    // Obtener el ID del monitor desde la sesión y luego cargar las actividades
    axios.post("../../backend/monitor/nombreMonitor.php", {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (response.data.success) {
            cargarActividadesDia(fecha);
        } else {
            console.error("❌ No se pudo obtener el ID del monitor.");
        }
    })
    .catch(error => {
        console.error("❌ Error verificando sesión del monitor:", error);
    });
});


function abrirActividad(fecha) {
    const urlDestino = `../monitorActividadesDia/monitorActividadesDia.html?fecha=${fecha}`;
    console.log("🔗 Redirigiendo a:", urlDestino);
    window.location.href = urlDestino;
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
