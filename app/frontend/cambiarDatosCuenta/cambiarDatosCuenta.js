document.addEventListener("DOMContentLoaded", function() {
    axios.post('../../backend/cambiarDatosPadre/cargarDatosPadre.php')
        .then(response => {
            if (response.data.success) {
                document.getElementById("nombrePadre").value = response.data.nombre;
                document.getElementById("dniPadre").value = response.data.dni;
                document.getElementById("telPadre").value = response.data.telefono;
                document.getElementById("telPadreAdicional").value = response.data.telefono_adicional;
            } else {
                console.error(response.data.message);
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos del padre:", error);
        });
});


document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();

    const data = {
        nombre: document.getElementById('nombrePadre').value.trim() || undefined,
        dni: document.getElementById('dniPadre').value.trim() || undefined,
        telefono: document.getElementById('telPadre').value.trim() || undefined,
        telefono_adicional: document.getElementById('telPadreAdicional').value.trim() || undefined
    };

    // Filtrar campos vacíos para no enviarlos
    const filteredData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined && value !== ''));

    if (Object.keys(filteredData).length === 0) {
        alert("No hay campos para actualizar.");
        return;
    }

    axios.post('../../backend/cambiarDatosPadre/actualizarDatosPadre.php', filteredData)
        .then(response => {
            if (response.data.success) {
                alert(response.data.message);
                window.location.href = '../cuentaPadre/cuentaPadre.html';
            } else {
                alert(response.data.message);
            }
        })
        .catch(error => {
            console.error("Error al actualizar los datos:", error);
        });
});
