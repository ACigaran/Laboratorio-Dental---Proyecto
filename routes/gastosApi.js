const express = require("express");
const router = express.Router();
const pool = require("../PaginaWeb/Datos/conexionBase.js"); 

// POST para agregar un nuevo gasto de material
router.post("/agregar", async (req, res) => {
    const { nombreMaterial, precioMaterial } = req.body;
    if (!nombreMaterial || !precioMaterial || isNaN(parseFloat(precioMaterial)) || parseFloat(precioMaterial) <= 0) {
        return res.status(400).json({ success: false, message: "Nombre del material y un precio válido son requeridos." });
    }
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible.");
        return res.status(503).json({success: false, message: "Error de conexión con la base de datos."});
    }
    const sql = "INSERT INTO GastosMaterial (NombreMaterial, Precio) VALUES (?, ?)";
    const params = [nombreMaterial, parseFloat(precioMaterial)];
    try {
        const [result] = await pool.query(sql, params);
        console.log(`Nuevo gasto de material registrado con ID: ${result.insertId}`);
        res.status(201).json({
            success: true,
            message: "Gasto de material agregado exitosamente.",
            gasto: {
                id: result.insertId,
                NombreMaterial: nombreMaterial,
                Precio: parseFloat(precioMaterial),
                FechaFormateada: new Date().toISOString().slice(0, 16).replace('T', ' ') 
            }
        });
    } catch (err) {
        console.error("Error al registrar gasto de material:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor al agregar el gasto." });
    }
});

module.exports = router;