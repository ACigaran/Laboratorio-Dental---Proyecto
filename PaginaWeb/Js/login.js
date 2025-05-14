let inptuser = document.getElementById('inputUsuario');
let inptcontra = document.getElementById('inputContraseña');

async function comprobarLogin() {
    const usuarioIngresado = inptuser.value;
    const contrasenaIngresada = inptcontra.value;
    if (!usuarioIngresado || !contrasenaIngresada) {
        alert("Por favor, ingrese usuario y contraseña.");
        return;
    }
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuarioIngresado,
                contrasena: contrasenaIngresada
            })
        });
        const data = await response.json(); 
        if (response.ok && data.success) { 
            console.log('Usuario y contraseña correcta\nBienvenido');
            localStorage.setItem('usuario', 'logeado'); 
            window.location.href = "/"; 
        } else {
            alert(data.message || "¡Credenciales incorrectas!");
        }
    } catch (error) {
        console.error('Error en el proceso de login:', error);
        alert("Ocurrió un error al intentar ingresar. Intente más tarde.");
    }
}