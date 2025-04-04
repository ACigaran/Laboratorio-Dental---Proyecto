// Usuario para pruebas
let user = 'admin';
let contra = '1234';

let inptuser = document.getElementById('inputUsuario');
let inptcontra = document.getElementById('inputContraseña');

function comprobarLogin() {
    if (user == inptuser.value && contra == inptcontra.value) {
        console.log('Usuario y contraseña correcta\nBienvenido');
        localStorage.setItem('usuario', 'logeado');
        window.location.href="../../PaginaWeb/Index.html"
    } else {
        alert("¡Credenciales incorrectas!");
    }
}
