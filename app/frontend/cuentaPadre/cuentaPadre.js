function cerrarSesion() {
    axios.post('../../backend/login/logout.php')
        .then(response => {
            if (response.data.success) {
                alert(response.data.message); // Muestra un mensaje de éxito
                window.location.href = '../paginaPrincipal/index.html'; // Redirecciona a la página de inicio o login
            } else {
                alert('Error al cerrar sesión.');
            }
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
        });
}
