// Array con las iniciales de los días de la semana en español
const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Elementos del DOM donde se mostrarán el mes y año, los días del calendario y los días seleccionados
const monthYearElement = document.getElementById('month-year');
const calendarDaysElement = document.getElementById('calendar-days');
const selectedDaysElement = document.getElementById('selected-days');

// Fecha actual
let currentDate = new Date();

// Array para almacenar los días seleccionados
let selectedDays = [];

// Función para renderizar el calendario
function renderCalendar() {
    // Limpia el contenido del calendario
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
            updateSelectedDaysDisplay();
        });
        
        // Añade el elemento del día al calendario
        calendarDaysElement.appendChild(dayElement);
    }
}

// Función para actualizar el elemento que muestra los días seleccionados
function updateSelectedDaysDisplay() {
    selectedDaysElement.textContent = selectedDays.join(', ');
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

// Renderiza el calendario al cargar la página
renderCalendar();