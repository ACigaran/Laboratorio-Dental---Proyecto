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
    if (!pacienteId || !trabajoId || precio_final_asignado === undefined || parseFloat(precio_final_asignado) <= 0) {
        return res.status(400).json({ success: false, message: "Datos incompletos o precio final inválido para la asignación." });
    }
    if (!pool) {
            console.error("Error: Pool de conexiones no disponible para asignar trabajo a paciente.");
            return res.status(503).json({success: false, message: "Error de conexión DB."});
    }
    const sql = `INSERT INTO PacientesTrabajosAsignados
                    (paciente_id, trabajo_paciente_id, extras_ganchos_cantidad, extras_dientes_cantidad, extras_cromo_con_dientes, precio_final_asignado, monto_cobrado, trabajo_entregado, fecha_asignacion)
                    VALUES (?, ?, ?, ?, ?, ?, 0.00, FALSE, NOW())`;
    const params = [
        pacienteId,
        trabajoId,
        parseInt(extras_ganchos_cantidad) || 0,
        parseInt(extras_dientes_cantidad) || 0,
        extras_cromo_con_dientes ? true : false,
        parseFloat(precio_final_asignado)
    ];
    try {
        const [result] = await pool.query(sql, params); 
        console.log(`Nueva asignación de trabajo ID ${result.insertId} para paciente ID ${pacienteId}`);
        res.status(201).json({ success: true, message: "Trabajo asignado al paciente correctamente.", asignacionId: result.insertId });
    } catch (err) {
        console.error("Error en API POST /pacientes/asignar-trabajo:", err);
        return res.status(500).json({ success: false, message: "Error interno al asignar trabajo." });
    }
});

    //         if (result.affectedRows === 0) {
    //             return res.status(404).json({ success: false, message: "Paciente no encontrado." });
    //         }
    //         console.log(`Trabajo ID ${trabajoId} con extras asignado al paciente ID ${pacienteId}`);
    //         res.json({ success: true, message: "Trabajo asignado al paciente correctamente con detalles." });
    //     } catch (err) {
    //         console.error("Error al asignar trabajo a paciente (con extras):", err);
    //         return res.status(500).json({ success: false, message: "Error interno al asignar trabajo." });
    //     }
    // });

router.put("/asignacion/:id/marcar-entregado", async (req, res) => {
    const asignacionId = req.params.id;
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para marcar entregado.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    try {
        const [result] = await pool.query(
            "UPDATE PacientesTrabajosAsignados SET trabajo_entregado = TRUE WHERE id = ? AND trabajo_entregado = FALSE",
            [asignacionId]
        );
        if (result.affectedRows === 0) {
            const [asignacionRows] = await pool.query("SELECT id FROM PacientesTrabajosAsignados WHERE id = ?", [asignacionId]);
            if (asignacionRows.length === 0) {
                return res.status(404).json({ success: false, message: "Asignación de trabajo para paciente no encontrada." });
            }
            return res.status(200).json({ success: true, message: "El trabajo del paciente ya estaba marcado como entregado." });
        }
        res.json({ success: true, message: "Trabajo del paciente marcado como entregado." });
    } catch (err) {
        console.error("Error al marcar trabajo de paciente como entregado:", err);
        res.status(500).json({ success: false, message: "Error interno al marcar como entregado." });
    }
});

module.exports = router;