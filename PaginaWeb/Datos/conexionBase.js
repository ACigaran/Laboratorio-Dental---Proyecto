require('dotenv').config();
const mysql = require('mysql2/promise');

let pool = null;

try {
    const configParaPool = {
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        queueLimit: 0,
        ssl: {}
    };
    
    const esConexionLocalOSinSSL = (
        configParaPool.host === 'localhost' ||
        configParaPool.host === '127.0.0.1' ||
        process.env.NO_SSL === 'true'
    );

    if (!esConexionLocalOSinSSL) {
        configParaPool.ssl.rejectUnauthorized = !(process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' || process.env.DB_SSL_REJECT_UNAUTHORIZED === '0');
        console.log("Configurando conexión DB remota con SSL. rejectUnauthorized:", configParaPool.ssl.rejectUnauthorized);
        // Aquí iría la lógica para fs.readFileSync si Railway te da un archivo CA para conexiones públicas
    } else {
        console.log("Conexión DB sin SSL (local o NO_SSL=true).");
        delete configParaPool.ssl;
    }
    pool = mysql.createPool(configParaPool);
    
    pool.getConnection()
        .then(connection => {
            console.log('¡Pool de conexiones DB conectado y listo!');
            connection.release(); 
        })
        .catch(err => {
            console.error('Error al obtener conexión inicial del pool DB:', err);
        });
    console.log("Pool de conexiones creado.");
} catch (error) {
    console.error("!!! Error CRÍTICO al crear el pool de conexiones:", error);
    pool = null; 
}

module.exports = pool;
