import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan'; // Use require here
import { ValidationPipe } from '@nestjs/common';
import { logger, stream } from './infrastructure/common/logger';
import { CREDENTIALS, LOG_FORMAT, NODE_ENV, PORT } from './config/environment';
import { HttpExceptionFilter } from './infrastructure/middlewares/error.middleware';
import { AppModule } from 'app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: CREDENTIALS,
  });

  //Middlware
  app.use(morgan(LOG_FORMAT, { stream })); // Logging middleware
  app.use(hpp()); // Prevent HTTP Parameter Pollution
  app.use(helmet()); // Security middleware
  app.use(compression()); // Enable compression for responses
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unknown fields
      forbidNonWhitelisted: true, // Throws an error for unknown fields
      transform: true, // Automatically transform payloads to DTO classes
    }),
  );

  // Error Middleware
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${NODE_ENV} =======`);
    logger.info(`🚀 App listening on the port ${PORT ?? 3000}`);
    logger.info(`=================================`);
  });
}
bootstrap();
