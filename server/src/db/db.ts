import mysql from 'mysql2/promise';
import { env } from '../config/env';

// Pool de conexiones — reutiliza conexiones en lugar de abrir una nueva cada vez
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Prueba de conexión al iniciar
export async function testConnection(): Promise<void> {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    conn.release();
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error);
    process.exit(1); // Detiene el servidor si no hay BD
  }
}

export default pool;
