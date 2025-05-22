const express = require("express");
const router = express.Router();
const pool = require("../PaginaWeb/Datos/conexionBase.js");

// Registrar pago para Paciente
router.post("/paciente-asignacion", async (req, res) => {
    const { asignacionId, montoPago } = req.body;
    if (!asignacionId || isNaN(parseFloat(montoPago)) || parseFloat(montoPago) <= 0) {
        return res.status(400).json({ success: false, message: "ID de asignación y monto de pago válidos son requeridos." });
    }
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para registrar pago paciente.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    try {
        const [asignacionRows] = await pool.query(
            "SELECT monto_cobrado, precio_final_asignado FROM PacientesTrabajosAsignados WHERE id = ?",
            [asignacionId]
        );
        if (asignacionRows.length === 0) {
            return res.status(404).json({ success: false, message: "Asignación de trabajo para paciente no encontrada." });
        }
        const asignacion = asignacionRows[0];
        const montoCobradoActual = parseFloat(asignacion.monto_cobrado) || 0;
        const precioFinal = parseFloat(asignacion.precio_final_asignado) || 0;
        const nuevoMontoCobrado = montoCobradoActual + parseFloat(montoPago);
        if (nuevoMontoCobrado > precioFinal + 0.001) {
            return res.status(400).json({ success: false, message: `El monto del pago excede el total adeudado.` });
        }
        await pool.query(
            "UPDATE PacientesTrabajosAsignados SET monto_cobrado = ? WHERE id = ?",
            [nuevoMontoCobrado, asignacionId]
        );
        res.json({ success: true, message: "Pago registrado para trabajo de paciente.", nuevoMontoCobrado: nuevoMontoCobrado, precioTotal: precioFinal });
    } catch (err) {
        console.error("Error al registrar pago para trabajo de paciente:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor al registrar pago." });
    }
});

// Registrar pago para Asignación de Consultorio
router.post("/consultorio-asignacion", async (req, res) => {
    const { asignacionId, montoPago } = req.body;
    if (!asignacionId || isNaN(parseFloat(montoPago)) || parseFloat(montoPago) <= 0) {
        return res.status(400).json({ success: false, message: "Datos de pago inválidos." });
    }
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para registrar pago consultorio.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    try {
        const [asignacionRows] = await pool.query(
            "SELECT monto_cobrado, precio_final_asignado FROM ConsultoriosTrabajosAsignados WHERE id = ?",
            [asignacionId]
        );
        if (asignacionRows.length === 0) {
            return res.status(404).json({ success: false, message: "Asignación de trabajo de consultorio no encontrada." });
        }
        const asignacion = asignacionRows[0];
        const montoCobradoActual = parseFloat(asignacion.monto_cobrado) || 0;
        const precioFinal = parseFloat(asignacion.precio_final_asignado) || 0;
        const nuevoMontoCobrado = montoCobradoActual + parseFloat(montoPago);
        if (nuevoMontoCobrado > precioFinal + 0.001) {
            return res.status(400).json({ success: false, message: `El monto del pago ($${parseFloat(montoPago).toFixed(2)}) excede el total adeudado ($${(precioFinal - montoCobradoActual).toFixed(2)}).` });
        }
        await pool.query(
            "UPDATE ConsultoriosTrabajosAsignados SET monto_cobrado = ? WHERE id = ?",
            [nuevoMontoCobrado, asignacionId]
        );
        res.json({ success: true, message: "Pago registrado.", nuevoMontoCobrado: nuevoMontoCobrado, precioTotal: precioFinal });
    } catch (err) {
        console.error("Error al registrar pago asignación consultorio:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor al registrar pago." });
    }
});

module.exports = router;