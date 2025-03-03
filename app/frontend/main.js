////////////////////////////////////////
// HEADER
////////////////////////////////////////
const openMenu = document.querySelector('.open-menu');
const closeMenu = document.querySelector('.close-menu');
const menu = document.getElementById("menu");
const header = document.getElementById("header-main");
const headerIndex = document.querySelector('.headerIndex');

if(header){
    
    if (headerIndex) {
        header.classList.add('sinSombra');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 0) {
                header.classList.remove('sinSombra');
            } else {
                header.classList.add('sinSombra');
            }
        });
    }

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
// CARRUSEL
////////////////////////////////////////
const slider = document.getElementById('slider');

if(slider){
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slide-next');
    
    let currentIndex = 0;
    const cards = document.querySelectorAll('.slider-item');
    const totalCards = cards.length;
    
    const updateSlider = () => {
      const cardWidth = cards[0].offsetWidth + 20; // width + margin
      slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    };
    
    // Botones de navegación
    nextBtn.addEventListener('click', () => {
      if (currentIndex < totalCards - 3) {
        currentIndex++;
      } else {
        currentIndex = 0; // Vuelve al principio
      }
      updateSlider();
    });
    
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = totalCards - 3; // Va al final
      }
      updateSlider();
    });
    
    // Funcionalidad de arrastrar
    let startX;
    let isDragging = false;
    
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - slider.offsetLeft;
      slider.style.cursor = 'grabbing';
    });
    
    slider.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
    
      const moveX = e.pageX - startX;
      slider.style.transform = `translateX(${moveX - currentIndex * (cards[0].offsetWidth + 20)}px)`;
    });
    
    slider.addEventListener('mouseup', () => {
      isDragging = false;
      slider.style.cursor = 'grab';
    
      // Ajuste al finalizar el arrastre
      const cardWidth = cards[0].offsetWidth + 20;
      const offset = Math.abs(slider.getBoundingClientRect().left - startX);
      currentIndex = Math.round(offset / cardWidth);
      if (currentIndex >= totalCards - 3) currentIndex = totalCards - 3;
      if (currentIndex < 0) currentIndex = 0;
    
      updateSlider();
    });
    
    slider.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        slider.style.cursor = 'grab';
        updateSlider();
      }
    });
    
    // Inicializa el slider
    updateSlider();
}



////////////////////////////////////////
// TARJETA ACORDEON
////////////////////////////////////////
const acordeon = document.querySelector('.accordion-title');

if (acordeon){
    document.querySelectorAll('.accordion-title').forEach(item => {
        item.addEventListener('click', function() {
          const parent = this.parentElement;
    
          // Si la sección está abierta, cerrarla, si no, abrirla
          parent.classList.toggle('active');
        });
    });
}


////////////////////////////////////////
// FLECHA SUBIR
////////////////////////////////////////
const scrollToTopBtn = document.getElementById('scrollToTop');

if(scrollToTopBtn){
    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 300) {
          scrollToTopBtn.classList.add('show'); // Agregar clase 'show' para que aparezca
        } else {
          scrollToTopBtn.classList.remove('show'); // Remover clase 'show' para ocultarla
        }
    });
      
    // Desplazar hacia arriba cuando se hace clic en la flecha
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

}


////////////////////////////////////////
// CAMPOS ADICIONALES
////////////////////////////////////////
const checkboxes = document.querySelectorAll('.checkbox-adicional');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const campoAdicional = this.closest('.field').querySelector('.campo-adicional');
        const inputs = campoAdicional.querySelectorAll('input');
        
        if (this.checked) {
            campoAdicional.style.display = "flex";
            inputs.forEach(input => input.classList.add('obligatorio'));
        } else {
            campoAdicional.style.display = "none";
            inputs.forEach(input => input.classList.remove('obligatorio'));
        }
    });
});


////////////////////////////////////////
// MOSTRAR CONTRASEÑA
////////////////////////////////////////
document.querySelectorAll('.mostrarPassword').forEach(icon => {
    icon.addEventListener('click', function() {
        const passwordInput = document.querySelector('#password');

        // Alternar entre 'password' y 'text'
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
});


////////////////////////////////////////
// CERRAR POPUP
////////////////////////////////////////
function closePopup() {
    const popups = document.querySelectorAll(".popup-container");
    popups.forEach(popup => popup.style.display = "none");
}


////////////////////////////////////////
// VALIDACIONES
////////////////////////////////////////

// Obtener el formulario
const formulario = document.getElementById('formulario');

// Modificar la función validarCampoEspecifico para incluir la validación del archivo
function validarCampoEspecifico(campo) {
    const errorSpan = campo.parentElement.querySelector(".error");
    const valor = campo.value.trim();

    // Si el campo tiene la clase "obligatorio" y está vacío, muestra error
    if (campo.classList.contains('obligatorio') && valor === '') {
        mostrarError(errorSpan, 'El campo no puede estar vacío.');
        console.log('Error: El campo obligatorio está vacío.');
        return false;
    } else if (valor != '') {

        // Si es un campo de tipo email, validar el formato
        if (campo.type === 'email' && !validarEmail(valor)) {
            mostrarError(errorSpan, 'Introduce un correo válido.');
            console.log('Error: El formato del correo electrónico no es válido.');
            return false;
        }

        // Validar DNI si el campo tiene la clase "dni"
        if (campo.classList.contains('dni') && !validarDNI(valor)) {
            mostrarError(errorSpan, 'Introduce un DNI válido.');
            console.log('Error: El formato del DNI no es válido.');
            return false;
        }

        // Validar teléfono si el campo es de tipo tel
        if (campo.type === 'tel' && !validarTelefono(valor)) {
            mostrarError(errorSpan, 'Introduce un número de teléfono válido.');
            console.log('Error: El formato del número de teléfono no es válido.');
            return false;
        }

        // Validar contraseña si el campo tiene el id password
        if (campo.id === 'password' && valor.length < 6) {
            mostrarError(errorSpan, 'La contraseña debe tener al menos 6 caracteres.');
            console.log('Error: La contraseña tiene menos de 6 caracteres.');
            return false;
        }

        // Validar edad si el campo tiene el id nacimientoHijo
        if (campo.id === 'nacimientoHijo' && !validarEdad(valor)) {
            mostrarError(errorSpan, 'La edad debe estar entre 6 y 7 años.');
            console.log('Error: La edad no está entre 6 y 7 años.');
            return false;
        }

        // Validar archivo si el campo es de tipo file
        if (campo.type === 'file') {
            return validarArchivo(campo);
        }
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

// Función para validar el formato del teléfono
function validarTelefono(numero) {
    const regex = /^[0-9]{9}$/;
    return regex.test(numero);
}

// Función para validar la edad (entre 6 y 7 años)
function validarEdad(fechaNacimiento) {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();
    const diaDiferencia = hoy.getDate() - fechaNac.getDate();

    // Ajustar edad si el cumpleaños aún no ha ocurrido este año
    if (mesDiferencia < 0 || (mesDiferencia === 0 && diaDiferencia < 0)) {
        return edad - 1 >= 6 && edad - 1 <= 7;
    }
    return edad >= 6 && edad <= 7;
}

// Función para validar el archivo subido
function validarArchivo(campo) {
    const errorSpan = campo.parentElement.querySelector(".error");
    const archivo = campo.files[0];

    if (archivo) {
        // Verificar que el archivo sea un PDF
        if (archivo.type !== 'application/pdf') {
            mostrarError(errorSpan, 'El archivo debe ser un PDF.');
            console.log('Error: El archivo no es un PDF.');
            return false;
        }

        // Verificar que el archivo no exceda los 10 MB
        if (archivo.size > 10 * 1024 * 1024) { // 10 MB en bytes
            mostrarError(errorSpan, 'El archivo no debe exceder los 10 MB.');
            console.log('Error: El archivo excede el tamaño máximo permitido.');
            return false;
        }
    }

    limpiarError(errorSpan);
    return true;
}

// Función para mostrar el error
function mostrarError(elementoError, mensaje) {
    if (!elementoError) return; // Si es null, salir de la función
    elementoError.style.display = 'inline';
    elementoError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${mensaje}`;
}

// Función para limpiar el error
function limpiarError(elementoError) {
    if (!elementoError) return; // Si es null, salir de la función
    elementoError.style.display = 'none';
}


// Seleccionar todos los inputs y añadir evento 'blur'
const inputs = document.querySelectorAll('input:not([type="button"]):not([type="checkbox"]):not([type="radio"])');
inputs.forEach(input => input.addEventListener('blur', () => validarCampoEspecifico(input)));

// Seleccionar el campo de archivo específico y añadir eventos 'change' y 'blur'
const campoCurriculum = document.querySelector('input[type="file"]');
if (campoCurriculum) {
    campoCurriculum.addEventListener('change', () => validarCampoEspecifico(campoCurriculum));
    campoCurriculum.addEventListener('blur', () => validarCampoEspecifico(campoCurriculum));
}

////////////////////////////////////////
// COOKIES
////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    // Crear las tablas
    axios.post("../backend/crear_tablas.php")
        .then(response => {
            console.log("Tablas creadas:", response.data);
        })
        .catch(error => {
            console.error("Error creando tablas:", error);
        });

        // Conseguir nombre padre
    axios.post("/PequenosNavegantes/app/backend/reserva/nombrePadre.php", {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        console.log("Respuesta del servidor:", response.data);
        const btnLogin = document.getElementById("btnlogin");
        const btnZarpa = document.getElementById("btnZarpa");
        if (response.data.success) {
            btnLogin.innerHTML = `<i class="fa-solid fa-user"></i> ${response.data.nombre}`;
            console.log("Sesión activa:", response.data.nombre);

            // Asegurar que solo se agrega el evento una vez
            btnLogin.removeEventListener("click", redirigirPerfil);
            btnLogin.addEventListener("click", redirigirPerfil);
            btnInscribirse.setAttribute("href", "/PequenosNavegantes/app/frontend/datosTutor/datosTutor.html");
            btnZarpa.setAttribute("href", "/PequenosNavegantes/app/frontend/datosTutor/datosTutor.html");

        } else {
            console.log("No hay sesión activa.");
            btnLogin.innerHTML = `<i class="fa-solid fa-user"></i> Acceso`;
            btnLogin.setAttribute("href", "/PequenosNavegantes/app/frontend/login/login.html");
            btnInscribirse.setAttribute("href", "/PequenosNavegantes/app/frontend/login/login.html");
            btnZarpa.setAttribute("href", "/PequenosNavegantes/app/frontend/login/login.html");
        }
    })
    .catch(error => {
        console.error("❌ Error verificando sesión:", error);
    });
    // Función para redirigir al perfil
    function redirigirPerfil() {
        window.location.href = "/PequenosNavegantes/app/frontend/cuentaPadre/cuentaPadre.html";
    }
});

