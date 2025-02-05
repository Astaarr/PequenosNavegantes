// Obtener elementos del DOM
const form = document.getElementById('formulario');

// Evento submit 
form.addEventListener('submit', (event) => {

    event.preventDefault(); // Evita el envío por defecto

    inputs.forEach(input => {
        console.log( input );
        if (!validarCampoEspecifico(input)) {
            formularioValido = false;
        }
    });

    const data = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    axios.post('/PequenosNavegantes/app/backend/registrarse/registrarse.php', JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        if (response.data.success) {
            alert('Padre registrado correctamente');
            window.location.href = '../../frontend/login/login.html';
        } else {
            alert(response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al crear cuenta', error);
    });

});



