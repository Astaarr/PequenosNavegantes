////////////////////////////////////////
// MENU HAMBURGUESA
////////////////////////////////////////
const openMenu = document.querySelector('.open-menu');
const closeMenu = document.querySelector('.close-menu');
const menu = document.getElementById("menu");


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