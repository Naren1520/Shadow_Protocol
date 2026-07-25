import { buildApp } from './app';
import { config } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';

async function main() {
  const app = await buildApp();

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down...`);
    await app.close();
    await disconnectDatabase();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  try {
    await connectDatabase();
    const host = config.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
    await app.listen({ port: config.PORT, host });
    app.log.info(`🚀 ShadowProtocol API running on http://${host}:${config.PORT}`);
    app.log.info(`📚 API Docs: http://localhost:${config.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    await disconnectDatabase();
    process.exit(1);
  }
}

main();
