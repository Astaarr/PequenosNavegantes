// Obtener elementos del DOM
const form = document.getElementById('formulario');
const popUp = document.getElementById('popupConfirmacion');
const errorGeneral = document.getElementById('errorGeneral');

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
            popUp.style.display = 'flex';
        }else{
            errorGeneral.style.display = 'inline';
            errorGeneral.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Correo o Contraseña incorrectos`;
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión como admin', error);
    });
});

function aceptarBtn(){
    popUp.style.display = "none";
    window.location.href = '../monitorPrincipal/monitorPrincipal.html';
}