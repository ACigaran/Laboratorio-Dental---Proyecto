require('dotenv').config();
const mysql = require('mysql2/promise');

let pool = null;

try {
    pool = mysql.createPool({
        connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, 
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true, 
        queueLimit: 0,
        ssl: {
            // ca: fs.readFileSync(path.join(__dirname, 'certs', 'nombre_del_certificado_ca.pem')),
            rejectUnauthorized: !(process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' || process.env.DB_SSL_REJECT_UNAUTHORIZED === '0')
        }
    });
    if (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1' || process.env.NO_SSL === 'true') {
        console.log("Conectando a DB local o NO_SSL=true, SSL deshabilitado para la conexión.");
        delete dbConfig.ssl;
    } else {
        console.log("Configurando conexión DB con SSL. rejectUnauthorized:", dbConfig.ssl.rejectUnauthorized);
    }

    pool = mysql.createPool(dbConfig);
    
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
