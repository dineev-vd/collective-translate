import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import YAML from 'yaml';
// somewhere in your initialization file

const { PORT, OPENAPI_FOLDER } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Collaborative Translate API')
    .setDescription('Collaborative Translate web-app API specification')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controller, method) => method,
  });

  fs.writeFileSync(
    `${__dirname}/../../openapi/collaborative-translate-api.yaml`,
    YAML.stringify(document),
  );
  SwaggerModule.setup('', app, document);

  app.use(cookieParser());
  await app.listen(PORT);
}

bootstrap();
