const express = require("express");
const router = express.Router();
require('dotenv').config(); 

router.post("/login", (req, res) => {
    const { usuario, contrasena } = req.body; 
    const adminUser = process.env.ADMIN_USER;
    const adminContra = process.env.ADMIN_CONTRA;
    if (!usuario || !contrasena) {
        return res.status(400).json({ success: false, message: "Usuario y contraseña son requeridos." });
    }
    if (usuario === adminUser && contrasena === adminContra) {
        console.log('Login exitoso para:', usuario);
        return res.json({ success: true, message: "Login exitoso." });
    } else {
        console.log('Intento de login fallido para:', usuario);
        return res.status(401).json({ success: false, message: "Credenciales incorrectas." });
    }
});

module.exports = router;