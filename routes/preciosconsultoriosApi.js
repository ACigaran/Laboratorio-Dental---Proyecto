const express = require("express");
const router = express.Router();
const pool = require("../PaginaWeb/Datos/conexionBase.js");

// POST para actualizar precios de consultorios
router.post("/actualizar", async (req, res) => {
    const preciosActualizados = req.body.precios;
    if (!preciosActualizados || !Array.isArray(preciosActualizados)) {
        return res.status(400).json({ success: false, message: "Datos inválidos." });
    }
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para actualizar precios consultorios.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    const updatePromises = preciosActualizados.map( async (precioInfo) => {
            const { id, precioContado } = precioInfo;
            if (id === undefined || precioContado === undefined || precioContado === '' || precioContado === null) {
                throw new Error(`Datos incompletos o inválidos para ID ${id}`);
            }
            const contado = parseFloat(precioContado);
            if (isNaN(contado)) {
                throw new Error(`Precio contado inválido para ID ${id}`);
            }
            
            const sql = "UPDATE TrabajosConsultorios SET PrecioContado = ? WHERE id = ?";
            const [result] = await pool.query(sql, [contado, id]);
            if (result.affectedRows === 0) {
            console.warn(`Advertencia (Consultorios): No se encontró el ID ${id} para actualizar.`);
            }
    });
    try {
        await Promise.all(updatePromises);
        console.log("Precios de consultorios actualizados correctamente.");
        res.json({ success: true, message: "Precios de consultorios actualizados correctamente." });
    } catch (error) {
        console.error("Error al actualizar uno o más precios de consultorios:", error);
        res.status(500).json({ success: false, message: "Error al guardar los cambios en la base de datos." });
    }
});

module.exports = router;