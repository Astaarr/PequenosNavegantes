document.addEventListener("DOMContentLoaded", function () {
    cargarCampamentos();
});

function cargarCampamentos() {
    axios.post('../../backend/cambiarDatosPadre/obtenerCampamentos.php')
        .then(response => {
            console.log(response.data);
            if (response.data.success) {
                const campamentos = response.data.campamentos;
                const groupContainer = document.getElementById('groupContainer');
                groupContainer.innerHTML = ''; // Limpiar contenedor antes de agregar los datos

                if (campamentos.length === 0) {
                    groupContainer.innerHTML = '<p>No tienes campamentos registrados.</p>';
                    return;
                }

                campamentos.forEach(campamento => {
                    const tarjeta = document.createElement('div');
                    tarjeta.className = 'tarjeta';
                    tarjeta.innerHTML = `
                        <div class="texto">
                            <h6 class="name">${campamento.nombre_hijo} ${campamento.apellidos_hijo}</h6>
                        </div>
                        <div class="fecha">
                            <i class="fa-solid fa-calendar"></i>
                            <span class="fecha">${formatearFecha(campamento.fecha_json)}</span>
                        </div>
                        <div class="icons">
                            <span class="icon edit" onclick="editarInscripcion(${campamento.id_inscripcion})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </span>
                        </div>
                    `;
                    groupContainer.appendChild(tarjeta);
                });
            } else {
                console.error(response.data.message);
            }
        })
        .catch(error => {
            console.error("Error al cargar los campamentos:", error);
        });
}

// Función para redirigir a la página de edición con la ID de inscripción
function editarInscripcion(idInscripcion) {
    window.location.href = `../editarInscripcion/editarInscripcion.html?id_inscripcion=${idInscripcion}`;
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
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
