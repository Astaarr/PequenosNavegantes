////////////////////////////////////////
// CAMBIAR OPCION CON CLICK EN DIV
////////////////////////////////////////

document.querySelectorAll('.metodoPago').forEach(contenedorMetPago => {
    contenedorMetPago.addEventListener('click', function(){
        // Eliminar la clase 'seleccionada' de todos los elementos
        document.querySelectorAll('.metodoPago').forEach(item => {
            item.classList.remove('seleccionada');
        });

        const input = contenedorMetPago.querySelector('input[name="metodoPago"]');

        if (input) {
            input.checked = true;
            contenedorMetPago.classList.add('seleccionada');
        } 
    });
});


////////////////////////////////////////
// CALCULAR PRECIO 
////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    // Recuperar datos de sessionStorage
    const datosTarifa = JSON.parse(sessionStorage.getItem("datosTarifa"));
    if (!datosTarifa) {
        console.error("No hay datos de tarifa en sessionStorage");
        return;
    }

    let { planSeleccionado, nDias } = datosTarifa;

    // Definir precios
    const precioPorDia = 20;
    const preciosPlan = {
        "basico": 0,
        "intermedio": 5,
        "avanzado": 15
    };

    // Calcular días gratis aplicados
    let diasGratis = 0;
    if (planSeleccionado === "intermedio") {
        diasGratis = Math.floor(nDias / 10); // 1 día gratis por cada 10 días
    } else if (planSeleccionado === "avanzado") {
        diasGratis = Math.floor(nDias / 5); // 1 día gratis por cada 5 días
    }

    // Calcular precio total sin modificar nDias
    const precioTotal = (nDias * precioPorDia) + preciosPlan[planSeleccionado] - (diasGratis * precioPorDia);

    // Insertar datos en la tarjeta de resumen
    document.getElementById("dias").textContent = nDias;
    document.getElementById("plan").textContent = `Plan ${planSeleccionado}`;
    document.getElementById("precioTotal").textContent = `${precioTotal.toFixed(2)}€`;

    // Mostrar días de descuento si aplica
    const descuentoElemento = document.getElementById("descuentos");
    if (diasGratis > 0) {
        descuentoElemento.textContent = `Días gratis aplicados: ${diasGratis}`;
    } else {
        descuentoElemento.textContent = "";
    }

    // Cambiar la imagen según el plan seleccionado
    const imagenResumen = document.querySelector(".resumen .imagen img");
    if (planSeleccionado === "intermedio") {
        imagenResumen.src = "../../../resources/img/plan_02.png";
    } else if (planSeleccionado === "avanzado") {
        imagenResumen.src = "../../../resources/img/plan_03.png";
    }
});



////////////////////////////////////////
// SUBMIT
////////////////////////////////////////
formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let pagoSeleccionado = false;
    const inputsRadio = document.querySelectorAll("input[type='radio']");
    const errorSpan = document.querySelector(".error");

    inputsRadio.forEach(input => {
        if (input.checked) { 
            pagoSeleccionado = true;
        }
    });

    if (pagoSeleccionado) {
        errorSpan.style.display = 'none';

        // Recuperar todos los datos de sessionStorage
        const datosTarifa = JSON.parse(sessionStorage.getItem("datosTarifa"));
        const datosTutor = JSON.parse(sessionStorage.getItem("datosTutor"));
        const datosHijo = JSON.parse(sessionStorage.getItem("datosHijo"));

        if (!datosTarifa || !datosTutor || !datosHijo) {
            console.error("Faltan datos en sessionStorage");
            return;
        }
        // Consolidar datos para el envío
        const datosReserva = {
            tarifa: datosTarifa,
            tutor: datosTutor,
            hijo: datosHijo
        };

        console.log("Enviando datos:", datosReserva);

        // ENVIAR DATOS A PHP CON AXIOS
        axios.post('/PequenosNavegantes/app/backend/reserva/reserva.php', datosReserva)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                if (response.data.success) {
                    sessionStorage.removeItem("datosTarifa");
                    sessionStorage.removeItem("datosTutor");
                    sessionStorage.removeItem("datosHijo");
                    sessionStorage.removeItem("selectedDays");
                    sessionStorage.removeItem("precioTotal");
                    document.querySelectorAll("input").forEach(input => input.value = "");

                    document.getElementById("popupContainer").style.display = "flex";
                } else {
                    console.error("Error en la respuesta del servidor:", response.data);
                }
            })
            .catch(error => {
                console.error("Error en la petición:", error);
            });

    } else {
        errorSpan.style.display = 'inline';
        errorSpan.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Selecciona Método de Pago primero`;
    }
});


function aceptarPopup(){
    document.getElementById("popupContainer").style.display = "none";
    window.location.href = '../cuentaPadre/cuentaPadre.html';
}