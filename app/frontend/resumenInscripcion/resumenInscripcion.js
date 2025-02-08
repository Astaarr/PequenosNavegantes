// CAMBIAR COLOR OPCION SELECCIONADA

document.querySelectorAll('input[name="metodoPago"]').forEach((input) => {
    input.addEventListener('change', function() {
        document.querySelectorAll('.tarjeta').forEach((tarjeta) => {
            tarjeta.classList.remove('seleccionada');
        });
        this.parentElement.classList.add('seleccionada');
    });
});

