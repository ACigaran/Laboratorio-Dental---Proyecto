require('dotenv').config();
const fs = require('fs');
const util = require('util');
const express = require("express");
const path = require('path');
const pool = require('./PaginaWeb/Datos/conexionBase.js');

const authApiRoutes = require('./routes/authApi.js');
const pagosApiRoutes = require('./routes/pagosApi.js');
const gastosApiRoutes = require('./routes/gastosApi.js');
const pacientesApiRoutes = require('./routes/pacientesApi');
const consultoriosApiRoutes = require('./routes/consultoriosApi.js');
const preciosPacientesApiRoutes = require('./routes/preciospacientesApi.js');
const preciosConsultoriosApiRoutes = require('./routes/preciosconsultoriosApi.js');

const app = express();
const PORT = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, "PaginaWeb")));

app.get("/", function(req, res){
    const pathToIndex = path.join(__dirname, 'PaginaWeb', 'Rutas', 'Index.html');

    console.log('Valor de __dirname (en ruta /):', __dirname);
    console.log('Intentando servir Index.html desde:', pathToIndex);
    
     if (fs.existsSync(pathToIndex)) {
         console.log('Index.html ENCONTRADO en:', pathToIndex);
        res.sendFile(pathToIndex);
    } else {
        console.error("Index.html NO ENCONTRADO en:", pathToIndex);
        try {
            console.log(`Intentando listar contenido de ${__dirname}:`);
            const parentDirContent = fs.readdirSync(path.join(__dirname));
            console.log(`Contenido de ${__dirname}:`, parentDirContent);
            
            const paginaWebDirContent = fs.readdirSync(path.join(__dirname, 'PaginaWeb'));
            console.log(`Intentando listar contenido de ${paginaWebDirContent}:`);
            
            if (fs.existsSync(paginaWebDirContent)) {
                const paginaWebContent = fs.readdirSync(paginaWebDirContent);
                console.log(`Contenido de ${paginaWebDirContent}:`, paginaWebContent);
                const rutasDirContent = fs.readdirSync(path.join(__dirname, 'PaginaWeb', 'Rutas'));
                console.log(`Intentando listar contenido de ${rutasDirContent}:`);
                
                if (fs.existsSync(rutasDirContent)) {
                    const rutasContent = fs.readdirSync(rutasDirContent);
                    console.log(`Contenido de ${rutasDirContent}:`, rutasContent);
                } else {
                    console.log(`Directorio ${rutasDirContent} NO EXISTE`);
                }
            } else {
                 console.log(`Directorio ${paginaWebDirContent} NO EXISTE`);
            }
        } catch (e) {
            console.error("Error listando directorios para depuración:", e.message);
        }
        res.status(404).send('Página principal no encontrada. Revisa los logs del servidor para la ruta correcta.');
    }
});
    //res.sendFile(path.join(__dirname, 'PaginaWeb', 'Rutas', 'Index.html'));
//});

app.get("/pacientes", async function(req, res){ 
    const ultimosPacientesSql = 'SELECT id, Nombre, Apellido FROM Pacientes ORDER BY ID DESC LIMIT 6;'; 
    if (!pool) { 
        console.error("Error: Pool de conexiones no está disponible para /pacientes.");
        return res.status(503).render('Pacientes', { pacientes: [], error: "Error de conexión DB."});
    }
    try {
        const [resultados] = await pool.query(ultimosPacientesSql); 
        console.log("Renderizando página de pacientes con datos.");
        res.render("Pacientes", { 
            pacientes: resultados,
            error: null
        });
    } catch (err) {
        console.error("Error al cargar los pacientes para la vista: ", err);
        res.status(500).render('Pacientes', {
            pacientes: [],
            error: "Error al cargar la lista de pacientes"
        });
    }
});

app.get("/consultorios", async function(req, res){ 
    const ultimosConsultoriosSql = 'SELECT id, Nombre, Direccion FROM Consultorios ORDER BY ID DESC LIMIT 6;';
    if (!pool) { 
        console.error("Error: Pool de conexiones no está disponible para /pacientes.");
        return res.status(503).render('Pacientes', { pacientes: [], error: "Error de conexión DB."});
    }
    try {
        const [resultados] = await pool.query(ultimosConsultoriosSql); 
        console.log("Renderizando página de consultorios con datos.");
        res.render("Consultorios", { 
            consultorios: resultados,
            error: null
        });
    } catch(err) {
        console.error("Error al cargar los consultorios para la vista: ", err);
        res.status(500).render('Consultorios', {
            consultorios: [], 
            error: "Error al cargar la lista de consultorios"
        });
    }
});

app.get("/precios", async function(req, res){ 
    const sql = 'SELECT id, Nombre, Tipo, PrecioContado, PrecioMercadolibre FROM TrabajosPacientes ORDER BY Tipo, id;';
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible.");
        return res.status(503).render('PreciosPacientes', {
            trabajos: [],
            error: "Error de conexión con la base de datos (Pool no disponible)."
        });
    }
    try {
        const [resultados] = await pool.query(sql); 
        console.log("Renderizando página de precios pacientes con datos.");
        res.render("PreciosPacientes", {
            trabajos: resultados,
            error: null
        });
    } catch(err) {
        console.error("Error al cargar la lista de precios pacientes: ", err);
        res.status(500).render('PreciosPacientes', {
            trabajos: [],
            error: "Error al cargar la lista de precios."
        });
    }
});

app.get("/precios-consultorios", async function(req, res){ 
    const sql = 'SELECT id, Nombre, Tipo, PrecioContado FROM TrabajosConsultorios ORDER BY Tipo, id;';
    if (!pool) { 
        console.error("Error: Pool de conexiones no está disponible para /pacientes.");
        return res.status(503).render('Pacientes', { pacientes: [], error: "Error de conexión DB."});
    }
    try {
        const [resultados] = await pool.query(sql); 
        console.log("Renderizando página de precios de consultorios con datos.");
        res.render("PreciosConsultorios", {
            trabajos: resultados,
            error: null
        });
    } catch (err) {
        console.error("Error al cargar la lista de precios de consultorios: ", err);
        res.status(500).render('PreciosConsultorios', {
            trabajos: [],
            error: "Error al cargar la lista de precios."
        });
    }
});

app.get("/trabajos-activos", async function(req, res){
    const sqlPacientesActivos = `
        SELECT
            p.id AS EntidadID,
            p.Nombre AS NombreEntidad,
            p.Apellido AS ApellidoEntidad,
            'Paciente' AS TipoEntidad,
            tp.Nombre AS NombreTrabajo,
            p.precio_final_asignado, /* Mostrar el precio final */
            p.extras_ganchos_cantidad,
            p.extras_dientes_cantidad,
            p.extras_cromo_con_dientes
            /* No necesitamos monto_cobrado aquí a menos que la tabla lo muestre explícitamente */
        FROM
            Pacientes p
        INNER JOIN
            TrabajosPacientes tp ON p.TrabajosPacientes_id = tp.id
        WHERE p.TrabajosPacientes_id IS NOT NULL AND p.trabajo_entregado = FALSE
        ORDER BY
            p.id DESC;
    `;
    const sqlConsultoriosActivos = `
        SELECT
            cta.id AS AsignacionID, /* ID de la fila en ConsultoriosTrabajosAsignados */
            c.id AS EntidadID,
            c.Nombre AS NombreEntidad,
            NULL AS ApellidoEntidad,
            'Consultorio' AS TipoEntidad,
            tc.Nombre AS NombreTrabajo,
            cta.precio_final_asignado, /* Mostrar el precio final de la asignación */
            cta.extras_ganchos_cantidad,
            cta.extras_dientes_cantidad,
            cta.extras_cromo_con_dientes
        FROM
            ConsultoriosTrabajosAsignados cta
        JOIN Consultorios c ON cta.consultorio_id = c.id
        JOIN TrabajosConsultorios tc ON cta.trabajo_consultorio_id = tc.id
        WHERE cta.trabajo_entregado = FALSE
        ORDER BY
            cta.fecha_asignacion DESC, cta.id DESC;
    `;
    const sqlTodosPacientes = "SELECT id, Nombre, Apellido FROM Pacientes ORDER BY Apellido, Nombre;";
    const sqlTodosConsultorios = "SELECT id, Nombre FROM Consultorios ORDER BY Nombre;";
    const sqlTodosTrabajosPacientes = "SELECT id, Nombre, PrecioContado, PrecioMercadoLibre FROM TrabajosPacientes ORDER BY Nombre;";
    const sqlTodosTrabajosConsultorios = "SELECT id, Nombre, PrecioContado FROM TrabajosConsultorios ORDER BY Nombre;";
    if (!pool) { 
        console.error("Error: Pool de conexiones no está disponible para /pacientes.");
        return res.status(503).render('Pacientes', { pacientes: [], error: "Error de conexión DB."});
    }
    try {
        const [
            [pacientesConTrabajos],
            [consultoriosConTrabajos],
            [listaPacientes],
            [listaConsultorios],
            [listaTrabajosPacientes],
            [listaTrabajosConsultorios]
        ] = await Promise.all([
            pool.query(sqlPacientesActivos),
            pool.query(sqlConsultoriosActivos),
            pool.query(sqlTodosPacientes),
            pool.query(sqlTodosConsultorios),
            pool.query(sqlTodosTrabajosPacientes),
            pool.query(sqlTodosTrabajosConsultorios)
        ]);
        res.render("TrabajosActivos", {
            pacientesConTrabajos,
            consultoriosConTrabajos,
            listaPacientes,
            listaConsultorios,
            listaTrabajosPacientes,
            listaTrabajosConsultorios,
            error: null
        });
    } catch (err) {
        console.error("Error al cargar datos para trabajos activos:", err);
        res.status(500).render('TrabajosActivos', {
            pacientesConTrabajos: [], consultoriosConTrabajos: [], listaPacientes: [],
            listaConsultorios: [], listaTrabajosPacientes: [], listaTrabajosConsultorios: [],
            error: { pageLoad: "Error al cargar la información de la página." }
        });
    }
});

app.get("/balance-mensual", async function(req, res){
    const sqlPacientesBalance = `
        SELECT
            p.id AS EntidadId, -- ID del Paciente
            p.TrabajosPacientes_id AS TrabajoOriginalId, -- ID del tipo de trabajo
            p.Nombre AS NombreEntidad,
            p.Apellido AS ApellidoEntidad,
            tp.Nombre AS NombreTrabajo,
            p.precio_final_asignado,
            p.monto_cobrado
        FROM
            Pacientes p
        INNER JOIN
            TrabajosPacientes tp ON p.TrabajosPacientes_id = tp.id
        WHERE
            p.TrabajosPacientes_id IS NOT NULL AND
            p.precio_final_asignado IS NOT NULL AND
            p.precio_final_asignado > 0 AND
            p.trabajo_entregado = FALSE; -- Solo los no entregados
    `;
    const sqlConsultoriosBalance = `
        SELECT
            cta.id AS AsignacionId, -- ID único de esta asignación específica
            c.id AS EntidadId, -- ID del Consultorio
            cta.trabajo_consultorio_id AS TrabajoOriginalId, -- ID del tipo de trabajo
            c.Nombre AS NombreEntidad,
            NULL AS ApellidoEntidad,
            tc.Nombre AS NombreTrabajo,
            cta.precio_final_asignado,
            cta.monto_cobrado
        FROM
            ConsultoriosTrabajosAsignados cta
        INNER JOIN
            Consultorios c ON cta.consultorio_id = c.id
        INNER JOIN
            TrabajosConsultorios tc ON cta.trabajo_consultorio_id = tc.id
        WHERE
            cta.precio_final_asignado IS NOT NULL AND
            cta.precio_final_asignado > 0 AND
            cta.trabajo_entregado = FALSE; -- Solo los no entregados
    `;
    if (!pool) { 
        console.error("Error: Pool de conexiones no está disponible para /pacientes.");
        return res.status(503).render('Pacientes', { pacientes: [], error: "Error de conexión DB."});
    }
    try{
        const [pacientesData] = await pool.query(sqlPacientesBalance);
        const [consultoriosData] = await pool.query(sqlConsultoriosBalance);
        let totalEstimado = 0;
        let totalCobrado = 0;
        let totalFaltante = 0;
        const todosLosTrabajos = [];
        const procesarDatos = (datos, tipoEntidad) => {
            datos.forEach(item => {
                const precioAsignado = parseFloat(item.precio_final_asignado || 0);
                const montoCobrado = parseFloat(item.monto_cobrado || 0);
                const faltante = precioAsignado - montoCobrado;
                totalEstimado += precioAsignado;
                totalCobrado += montoCobrado;
                totalFaltante += faltante;
                todosLosTrabajos.push({
                    idParaActualizar: tipoEntidad === 'Paciente' ? item.EntidadId : item.AsignacionId,
                    nombreCompleto: tipoEntidad === 'Paciente' ? `${item.NombreEntidad} ${item.ApellidoEntidad}` : item.NombreEntidad,
                    nombreTrabajo: item.NombreTrabajo,
                    precio: precioAsignado,
                    cobrado: montoCobrado,
                    faltante: faltante,
                    tipoEntidad: tipoEntidad
                });
            });
        };
        procesarDatos(pacientesData, 'Paciente');
        procesarDatos(consultoriosData, 'Consultorio');
        todosLosTrabajos.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
        res.render("BalanceMensual", {
            trabajosParaBalance: todosLosTrabajos,
            totalEstimado, totalCobrado, totalFaltante, error: null
        });
    } catch (err) {
        console.error("Error al cargar datos para balance mensual:", err);
        res.status(500).render('BalanceMensual', {
            trabajosParaBalance: [], totalEstimado: 0, totalCobrado: 0, totalFaltante: 0,
            error: "Error al cargar la información del balance."
        });
    }
});

app.get("/gastos-material", async function(req, res){ 
    const sql = "SELECT id, NombreMaterial, Precio, DATE_FORMAT(FechaGasto, '%Y-%m-%d %H:%i') AS FechaFormateada FROM GastosMaterial ORDER BY FechaGasto DESC, id DESC;";
    if (!pool) {
        console.error("Error: Pool de conexiones no está disponible para /gastos-material.");
        return res.status(503).render('GastosMaterial', { gastos: [], error: "Error de conexión DB."});
    }
    try {
        const [resultados] = await pool.query(sql);
        res.render("GastosMaterial", {
            gastos: resultados,
            error: null
        });
    } catch (err) {
        console.error("Error al cargar los gastos de material: ", err);
        res.status(500).render('GastosMaterial', {
            gastos: [],
            error: "Error al cargar la lista de gastos."
        });
    }
});

app.use('/api/auth', authApiRoutes);
app.use("/api/pagos", pagosApiRoutes);
app.use("/api/pacientes", pacientesApiRoutes);
app.use("/api/gastos-material", gastosApiRoutes);
app.use("/api/precios", preciosPacientesApiRoutes);
app.use("/api/consultorios", consultoriosApiRoutes);
app.use("/api/precios-consultorios", preciosConsultoriosApiRoutes);

app.listen(PORT,function(){
    console.log(`¡Servidor en linea acceda en http://localhost:${PORT}`);
    console.log(`Accede a la lista de trabajos en http://localhost:${PORT}/precios`);
    console.log(`Accede a la lista de pacientes en http://localhost:${PORT}/pacientes`);
    console.log(`Accede a la lista de consultorios en http://localhost:${PORT}/consultorios`);
    console.log(`Accede a la lista de trabajos activos en http://localhost:${PORT}/trabajos-activos`);
    console.log(`Accede a la lista de trabajos consultorios en http://localhost:${PORT}/precios-consultorios`);
});
