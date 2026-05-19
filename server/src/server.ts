import app from './app';
import { env } from './config/env';
import { testConnection } from './db/db';

async function main() {
  // Primero verifica la conexión a MySQL
  await testConnection();

  // Luego levanta el servidor
  app.listen(env.port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
    console.log(`📡 API disponible en http://localhost:${env.port}/api`);
    console.log(`🔍 Health check: http://localhost:${env.port}/api/health`);
  });
}

main().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
