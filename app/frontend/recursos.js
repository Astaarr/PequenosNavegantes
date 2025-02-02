////////////////////////////////////////
// HEADER
////////////////////////////////////////
const openMenu = document.querySelector('.open-menu');
const closeMenu = document.querySelector('.close-menu');
const menu = document.getElementById("menu");
const header = document.getElementById("header-main");

if(header){
    openMenu.addEventListener('click', function() {
        openMenu.style.display = "none";
        closeMenu.style.display = "block";
        menu.style.right = "0";
    
    });
    
    closeMenu.addEventListener('click', function() {
        openMenu.style.display = "block";
        closeMenu.style.display = "none";
        menu.style.right = "-500px";
    
    });

    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            header.style.top = "-100px";
        } else {
            header.style.top = "0";
        }
        
        lastScrollTop = scrollTop;
    });
}


////////////////////////////////////////
// CAMPOS ADICIONALES
////////////////////////////////////////
const checkboxes = document.querySelectorAll('.checkbox-adicional');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const campoAdicional = this.closest('.field').querySelector('.campo-adicional');
        if (this.checked) {
            campoAdicional.style.display = "flex";
        } else {
            campoAdicional.style.display = "none";
        }
    });
});


////////////////////////////////////////
// VALIDACIONES
////////////////////////////////////////

// Obtener el formulario
const form = document.getElementById('formulario');

// Validar campo
function validarCampoEspecifico(campo) {
    const errorSpan = campo.parentElement.querySelector(".error");
    const valor = campo.value.trim();

    // Si el campo tiene la clase "obligatorio" y está vacío, muestra error
    if (campo.classList.contains('obligatorio') && valor === '') {
        mostrarError(errorSpan, 'El campo no puede estar vacío.');
        return false;
    }

    // Si es un campo de tipo email, validar el formato
    if (campo.type === 'email' && valor !== '' && !validarEmail(valor)) {
        mostrarError(errorSpan, 'Introduce un correo válido.');
        return false;
    }

    // Validar DNI si el campo tiene la clase "dni"
    if (campo.classList.contains('dni') && valor !== '' && !validarDNI(valor)) {
        mostrarError(errorSpan, 'Introduce un DNI válido.');
        return false;
    }

    // Validar contraseña si el campo es de tipo password
    if (campo.type === 'password' && valor !== '' && valor.length < 6) {
        mostrarError(errorSpan, 'La contraseña debe tener al menos 6 caracteres.');
        return false;
    }

    limpiarError(errorSpan);
    return true;
}

// Función para validar el formato de un email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar el formato del DNI
function validarDNI(dni) {
    const regex = /^[0-9]{8}[A-Za-z]$/; // Formato DNI español: 8 dígitos + letra
    return regex.test(dni);
}

// Función para mostrar el error
function mostrarError(elementoError, mensaje) {
    elementoError.style.display = 'inline';
    elementoError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${mensaje}`;
}

// Función para limpiar el error
function limpiarError(elementoError) {
    elementoError.style.display = 'none';
}

// Seleccionar todos los inputs y añadir evento 'blur'
const inputs = document.querySelectorAll('input');
inputs.forEach(input => input.addEventListener('blur', () => validarCampoEspecifico(input)));

// Validar el formulario al enviarlo
form.addEventListener('submit', function(event) {
    let formularioValido = true;

    inputs.forEach(input => {
        if (!validarCampoEspecifico(input)) {
            formularioValido = false;
        }
    });

    if (!formularioValido) {
        event.preventDefault(); // Evita el envío del formulario si hay errores
    }
});

