////////////////////////////////////////
// CALENDARIO
////////////////////////////////////////

const precioUnitario = 20;

// Array con las iniciales de los días de la semana en español
const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Elementos del DOM donde se mostrarán el mes y año y los días del calendario
const monthYearElement = document.getElementById('month-year');
const calendarDaysElement = document.getElementById('calendar-days');
const clearButton = document.getElementById('clear-selection'); // Botón para limpiar selección

// Elementos del DOM para mostrar días seleccionados y precio total
const diasSelectedElement = document.getElementById('diasSelected');
const diasPrecioElement = document.getElementById('diasPrecio');

// Fecha actual
let currentDate = new Date();

// Array para almacenar los días seleccionados (guardado en sessionStorage)
let selectedDays = JSON.parse(sessionStorage.getItem("selectedDays")) || [];

// Función para renderizar el calendario
function renderCalendar() {
    calendarDaysElement.innerHTML = '';

    // Muestra el mes y año actual
    monthYearElement.textContent = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    // Calcula el primer día del mes y el número de días en el mes
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    let daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    let prevDays = (firstDay === 0) ? 6 : firstDay - 1;

    // Añade elementos vacíos para los días previos al primer día del mes
    for (let i = 0; i < prevDays; i++) {
        const emptyDiv = document.createElement('div');
        calendarDaysElement.appendChild(emptyDiv);
    }

    // Crea elementos para cada día del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.classList.add('day');

        // Formatea la fecha como clave
        let dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Marca los días seleccionados
        if (selectedDays.includes(dateKey)) {
            dayElement.classList.add('selected');
        }

        // Añade eventos de clic para seleccionar/deseleccionar días
        dayElement.addEventListener('click', () => {
            if (selectedDays.includes(dateKey)) {
                selectedDays = selectedDays.filter(d => d !== dateKey);
                dayElement.classList.remove('selected');
            } else {
                selectedDays.push(dateKey);
                dayElement.classList.add('selected');
            }
            guardarSeleccion();
        });

        // Añade el elemento del día al calendario
        calendarDaysElement.appendChild(dayElement);
    }
}

// Función para actualizar el número de días seleccionados y el precio total
function actualizarDiasSeleccionados() {
    diasSelectedElement.textContent = selectedDays.length;
    actualizarPrecioTotal();
}

// Función para calcular y actualizar el precio total
function actualizarPrecioTotal() {
    const precioTotal = selectedDays.length * precioUnitario;
    diasPrecioElement.textContent = precioTotal.toFixed(2) + "€";

    sessionStorage.setItem("precioTotal", precioTotal.toFixed(2));
}

// Función para guardar la selección en sessionStorage
function guardarSeleccion() {
    sessionStorage.setItem("selectedDays", JSON.stringify(selectedDays));
    actualizarDiasSeleccionados();
}

// Función para limpiar todos los días seleccionados
function clearSelection() {
    selectedDays = [];
    sessionStorage.removeItem("selectedDays");

    document.querySelectorAll('.day.selected').forEach(day => {
        day.classList.remove('selected');
    });

    actualizarDiasSeleccionados();
}

// Función para cambiar al mes anterior y renderizar el calendario
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// Función para cambiar al próximo mes y renderizar el calendario
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Muestra los días de la semana
document.getElementById('weekdays').innerHTML = weekdays.map(day => `<div class="weekday">${day}</div>`).join('');

// Evento para el botón de limpiar selección
if (clearButton) {
    clearButton.addEventListener('click', clearSelection);
}

// Renderiza el calendario al cargar la página
renderCalendar();
actualizarDiasSeleccionados();



////////////////////////////////////////
// SUBMIT
////////////////////////////////////////

// Función para guardar los datos en sessionStorage
function guardarDatos(datos) {
    sessionStorage.setItem("datosTarifa", JSON.stringify(datos));
}

//Planes
let planSeleccionado = null; 

function planBasico() {
    planSeleccionado = "basico";
    enviarDatos();
}

function planIntermedio() {
    planSeleccionado = "intermedio";
    enviarDatos();
}

function planAvanzado() {
    planSeleccionado = "avanzado";
    enviarDatos();
}

//Enviar datos
function enviarDatos() {

    if(selectedDays.length==0){
        const errorSpan = document.querySelector(".error");
        errorSpan.style.display = 'inline';
        errorSpan.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Selecciona los Días de Inscripción primero`;
    }else{
        const precioTotal = parseFloat(sessionStorage.getItem("precioTotal")) || 0;
        const datosTarifa = {
            planSeleccionado: planSeleccionado,
            nDias: selectedDays.length,
            diasSeleccionados: selectedDays,
            precioTotal: precioTotal
        };

        // Guardar en sessionStorage
        guardarDatos(datosTarifa);

        window.location.href = '../resumenInscripcion/resumenInscripcion.html';
    }

}