// Obtener elementos del DOM
const form = document.getElementById('formulario');

form.addEventListener('submit', (event) =>{

    event.preventDefault();

    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    console.log("Datos enviados:", data);

    axios.post('/PequenosNavegantes/app/backend/login/loginMonitor.php', JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        if(response.data.success){
            alert('Login exitoso monitor');
            window.location.href = '../../frontend/paginaPrincipal/index.html';
        }else{
            alert(response.data.message || "Error en el inicio de sesión como monitor");
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión como admin', error);
    });
});