const express = require("express");
const router = express.Router();
const pool = require("../PaginaWeb/Datos/conexionBase.js");

// POST para actualizar precios
router.post("/actualizar", async (req, res) => {
    const preciosActualizados = req.body.precios;
    if (!preciosActualizados || !Array.isArray(preciosActualizados)) {
        return res.status(400).json({ success: false, message: "Datos inválidos." });
    }
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para actualizar precios pacientes.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    const updatePromises = preciosActualizados.map( async (precioInfo) => {
        
        const { id, precioContado, precioMercadoLibre } = precioInfo;
        if (id === undefined || precioContado === undefined) {
            throw new Error(`Datos incompletos para ID ${id}`);
        }
        const contado = parseFloat(precioContado);
        const mlibre = (precioMercadoLibre === '' || precioMercadoLibre === null || precioMercadoLibre === undefined)
                        ? null
                        : parseFloat(precioMercadoLibre);
        if (isNaN(contado) || (mlibre !== null && isNaN(mlibre))) {
            throw new Error(`Precio inválido para ID ${id}`);
        }
        const sql = "UPDATE TrabajosPacientes SET PrecioContado = ?, PrecioMercadolibre = ? WHERE id = ?";
        const [result] = await pool.query(sql, [contado, mlibre, id]);
        if (result.affectedRows === 0) {
            console.warn(`Advertencia (Pacientes): No se encontró el ID ${id} para actualizar.`);
        }
    });
    try {
        await Promise.all(updatePromises);
        console.log("Precios actualizados correctamente.");
        res.json({ success: true, message: "Precios actualizados correctamente." });
    } catch (error) {
        console.error("Error al actualizar uno o más precios:", error);
        res.status(500).json({ success: false, message: "Error al guardar los cambios en la base de datos." });
    }
});

module.exports = router;