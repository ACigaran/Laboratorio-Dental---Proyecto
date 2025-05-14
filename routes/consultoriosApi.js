const express = require("express");
const router = express.Router();
const pool = require("../PaginaWeb/Datos/conexionBase.js");

router.post("/validar", async function(req, res){
    const datos = req.body;
    if (!datos.nomb || !datos.dir) {
        return res.status(400).json({error: "Nombre y Direccion son requeridos."});
    }
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para validar consultorio.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    try{
        let nombre = datos.nomb;
        let direccion = datos.dir;
        const buscarSql = "SELECT * FROM Consultorios WHERE Nombre = ? AND Direccion = ?"; 
        const [rows] = await pool.query(buscarSql, [nombre, direccion]); 
        if(rows.length > 0){
            console.log("Consultorio ya existente");
            return res.status(409).json({message:"El consultorio ya está registrado."});
        } else {
            const registrarSql = "INSERT INTO Consultorios (Nombre, Direccion) VALUES (?,?)";
            const [result] = await pool.query(registrarSql, [nombre, direccion]); 
            console.log("¡Consultorio registrado con éxito! ID:", result.insertId);
            res.redirect('/consultorios');
        }
    } catch (err) {
        console.error("Error en API POST /consultorios/validar:", err);
        return res.status(500).json({error:"Error interno del servidor."});
    }
});

router.post("/asignar-trabajo", async function(req, res){
    const {
        consultorioId,         
        trabajoId,             
        extras_ganchos_cantidad,
        extras_dientes_cantidad,
        extras_cromo_con_dientes,
        precio_final_asignado  
    } = req.body;
    if (!consultorioId || !trabajoId || precio_final_asignado === undefined || parseFloat(precio_final_asignado) <= 0) {
        return res.status(400).json({ success: false, message: "Datos incompletos o precio final inválido para la asignación." });
    }
    if (!pool) {
        console.error("Error: Pool de conexiones no disponible para asignar trabajo a consultorio.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    const sql = `INSERT INTO ConsultoriosTrabajosAsignados
                    (consultorio_id, trabajo_consultorio_id, extras_ganchos_cantidad, extras_dientes_cantidad, extras_cromo_con_dientes, precio_final_asignado, monto_cobrado, trabajo_entregado, fecha_asignacion)
                VALUES (?, ?, ?, ?, ?, ?, 0.00, FALSE, NOW())`;
    const params = [
        consultorioId,
        trabajoId,
        parseInt(extras_ganchos_cantidad) || 0,
        parseInt(extras_dientes_cantidad) || 0,
        extras_cromo_con_dientes ? true : false, 
        parseFloat(precio_final_asignado)
    ];
    try {
        const [result] = await pool.query(sql, params); 
            console.log(`Nueva asignación de trabajo ID ${result.insertId} para consultorio ID ${consultorioId}`);
            res.status(201).json({ success: true, message: "Trabajo asignado al consultorio correctamente.", asignacionId: result.insertId });
        } catch (err){
            console.error("Error al insertar asignación de trabajo a consultorio:", err);
            return res.status(500).json({ success: false, message: "Error interno al asignar trabajo." });
        }
    }
);

router.put("/asignacion/:id/marcar-entregado", async (req, res) => {
    const asignacionId = req.params.id;
    if (!pool) {
        console.error("Error: Pool de conexiones no disponible para marcar entregado consultorio.");
        return res.status(503).json({error: "Error de conexión con la base de datos."});
    }
    try {
        const [result] = await pool.query(
            "UPDATE ConsultoriosTrabajosAsignados SET trabajo_entregado = TRUE WHERE id = ? AND trabajo_entregado = FALSE",
            [asignacionId]
        );
        if (result.affectedRows === 0) {
            const [asignacionRows] = await pool.query("SELECT id FROM ConsultoriosTrabajosAsignados WHERE id = ?", [asignacionId]);
            if (asignacionRows.length === 0) {
                return res.status(404).json({ success: false, message: "Asignación de trabajo de consultorio no encontrada." });
            }
            return res.status(200).json({ success: true, message: "El trabajo del consultorio ya estaba marcado como entregado o no se encontró un trabajo activo." });
        }
        res.json({ success: true, message: "Trabajo de consultorio marcado como entregado." });
    } catch (err) {
        console.error("Error al marcar trabajo consultorio como entregado:", err);
        res.status(500).json({ success: false, message: "Error interno al marcar como entregado." });
    }
});

module.exports = router;