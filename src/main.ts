import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    cookieSession({
      name: 'session',
      maxAge: 24 * 7 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 24 * 7 * 60 * 60 * 1000),
      sameSite: 'lax',
      domain: 'localhost',
      path: '/',
      secure: false,
      keys: ['SECRET_ONE', 'SECRET_TWO'],
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const result =
          errors[0].constraints[Object.keys(errors[0].constraints)[0]];
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  await app.listen(4000);
}
bootstrap();
