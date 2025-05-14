const express = require("express");
const router = express.Router();

const pool = require("../PaginaWeb/Datos/conexionBase.js");

// POST PARA AGREGAR UN NUEVO PACIENTE
router.post("/validar", async function(req, res){
    const datos = req.body;
    if (!datos.nomb || !datos.apell) {
        return res.status(400).json({error: "Nombre y Apellido son requeridos."});
    }
    if (!pool) { 
        console.error("Error: Pool de conexiones no está disponible para validar paciente.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    try {
        let nombre = datos.nomb;
        let apellido = datos.apell;
        const buscarSql = "SELECT * FROM Pacientes WHERE Nombre = ? AND Apellido = ?";
        const [rows] = await pool.query(buscarSql, [nombre, apellido]);
        if(rows.length>0){
            console.log("Usuario ya existente");
            return res.status(409).json({message:"El paciente ya está registrado."});
        } else {
            const registrarSql = "INSERT INTO Pacientes (Nombre, Apellido) VALUES (?,?)";
            const [result] = await pool.query(registrarSql, [nombre, apellido]);
            console.log("¡Usuario registrado con éxito! ID:", result.insertId);
            res.redirect('/pacientes');
        
        }
    } catch (err) {
        console.error("Error en API /validar paciente: ", err);
        return res.status(500).json({error:"Error interno del servidor."});
    }
});

router.post("/asignar-trabajo", async function(req, res){
    const {
        pacienteId,
        trabajoId,
        extras_ganchos_cantidad,
        extras_dientes_cantidad,
        extras_cromo_con_dientes,
        precio_final_asignado
    } = req.body;
    if (!pool) {
            console.error("Error: Pool de conexiones no disponible para asignar trabajo a paciente.");
            return res.status(503).json({success: false, message: "Error de conexión DB."});
    }
    const sql = `UPDATE Pacientes SET
                    TrabajosPacientes_id = ?,
                    extras_ganchos_cantidad = ?,
                    extras_dientes_cantidad = ?,
                    extras_cromo_con_dientes = ?,
                    precio_final_asignado = ?
                WHERE id = ?`;
    const params = [
        trabajoId,
        extras_ganchos_cantidad || 0, 
        extras_dientes_cantidad || 0,
        extras_cromo_con_dientes || false,
        precio_final_asignado || null, 
        pacienteId
    ];
    try {
            const [result] = await pool.query(sql, params); 
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Paciente no encontrado." });
            }
            console.log(`Trabajo ID ${trabajoId} con extras asignado al paciente ID ${pacienteId}`);
            res.json({ success: true, message: "Trabajo asignado al paciente correctamente con detalles." });
        } catch (err) {
            console.error("Error al asignar trabajo a paciente (con extras):", err);
            return res.status(500).json({ success: false, message: "Error interno al asignar trabajo." });
        }
    });

router.put("/:id/marcar-entregado", async (req, res) => {
    const pacienteId = req.params.id;
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para marcar entregado.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    try {
        const [result] = await pool.query(
            "UPDATE Pacientes SET trabajo_entregado = TRUE WHERE id = ? AND trabajo_entregado = FALSE", 
            [pacienteId]
        );
        if (result.affectedRows === 0) {
            const [pacienteRows] = await pool.query("SELECT id FROM Pacientes WHERE id = ?", [pacienteId]);
            if (pacienteRows.length === 0) {
                return res.status(404).json({ success: false, message: "Paciente no encontrado." });
            }
            return res.status(200).json({ success: true, message: "El trabajo del paciente ya estaba marcado como entregado o no requería actualización." });
        }
        res.json({ success: true, message: "Trabajo del paciente marcado como entregado." });
    } catch (err) {
        console.error("Error en API PUT /pacientes/:id/marcar-entregado:", err);
        res.status(500).json({ success: false, message: "Error interno al marcar como entregado." });
    }
});

module.exports = router;