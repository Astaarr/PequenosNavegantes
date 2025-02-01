////////////////////////////////////////
// HEADER
////////////////////////////////////////
const openMenu = document.querySelector('.open-menu');
const closeMenu = document.querySelector('.close-menu');
const menu = document.getElementById("menu");
const header = document.querySelector("header");


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