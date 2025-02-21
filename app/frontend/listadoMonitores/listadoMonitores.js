document.addEventListener("DOMContentLoaded", function () {
    cargarMonitores();
});

// Función para cargar y mostrar los monitores
function cargarMonitores() {
    axios.get('../../backend/monitor/obtener_monitores.php')
    
        .then(response => {
            console.log("Respuesta del servidor:", response.data); // Depuración

            if (response.data && response.data.success) {
                const monitores = response.data.monitores;
                const contenedorTarjetas = document.getElementById("groupContainer");

                // Limpiar el contenedor antes de agregar nuevas tarjetas
                contenedorTarjetas.innerHTML = '';

                monitores.forEach(monitor => {
                    const tarjeta = document.createElement('div');
                    tarjeta.classList.add('t4', 'tarjeta', 'columna');
                    tarjeta.setAttribute('data-id', monitor.id_solicitud);

                    tarjeta.innerHTML = `
                        <div class="nombreCompleto">
                            <h6>${monitor.nombre} ${monitor.apellidos}</h6>
                        </div>

                        <div class="detalles">
                            <div class="contacto">
                                <span class="correo"><i class="fa-solid fa-envelope"></i> ${monitor.email}</span>
                                <span class="telefono"><i class="fa-solid fa-phone"></i> ${monitor.telefono}</span>
                            </div>
                        </div>

                        <div class="infoAdicional">
                            <span class="curriculum"><i class="fa-solid fa-file"></i> Descargar CV</span>
                        </div>

                        <div class="acciones">
                            <span class="icon"><i class="fa-solid fa-user-plus"></i></span>
                            <span class="icon"><i class="fa-solid fa-user-minus"></i></span>
                        </div>
                    `;

                    // Añadir evento de clic para descargar el CV
                    const curriculumSpan = tarjeta.querySelector('.curriculum');
                    curriculumSpan.addEventListener('click', () => {
                        descargarCurriculum(monitor.curriculum);
                    });

                    contenedorTarjetas.appendChild(tarjeta);
                });
            } else {
                console.error("Error al obtener monitores:", response.data ? response.data.message : "Respuesta no válida del servidor");
                alert("Error: " + (response.data ? response.data.message : "No se pudo cargar la información de los monitores."));
            }
        })
        .catch(error => {
            console.error('Error al obtener monitores:', error);
            alert("Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.");
        });
}

// Función para descargar el CV
function descargarCurriculum(urlCurriculum) {
    const link = document.createElement('a');
    link.href = urlCurriculum;
    link.download = 'curriculum.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}