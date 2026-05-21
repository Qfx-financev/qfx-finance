import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ─── Global Pipes ─────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ─── CORS ─────────────────────────────────────────────
  app.enableCors({
    origin: [
      'https://qfx-finance.com',
      'https://www.qfx-finance.com',
      'http://localhost:3000',
      'http://localhost:3002',
    ],
    credentials: true,
  });

  // ─── Global Prefix ────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── Swagger ──────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('QFX Finance API')
    .setDescription('QFX Finance — Crypto Banking & Investment Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 QFX API running on port ${port}`, 'Bootstrap');
  Logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`, 'Bootstrap');
}
bootstrap();
