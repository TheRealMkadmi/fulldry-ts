import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { patchNestJsSwagger } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';
import process from 'node:process';

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly configService: ConfigService) {}

  initSwagger(app: NestExpressApplication) {
    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      patchNestJsSwagger();
      new ConsoleLogger(SwaggerConfigService.name).log('Swagger enabled');

      const config = new DocumentBuilder()
        .setTitle(this.configService.get<string>('SWAGGER_TITLE', 'fulldry-ts'))
        .addServer(this.configService.get<string>('SWAGGER_URL', `http://localhost:${process.env.API_PORT || 8080}`))
        .setDescription(this.configService.get<string>('SWAGGER_DESCRIPTION', 'The Full Dry API description'))
        .setVersion(this.configService.get<string>('SWAGGER_VERSION', '1.0'))
        .addBearerAuth({
          name: 'Authorization',
          description: 'Please enter token in following format: Bearer <JWT>',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'header',
        })
        .addSecurityRequirements('Authorization')
        .build();

      SwaggerModule.setup(
        this.configService.get<string>('SWAGGER_PATH', '/swagger'),
        app,
        SwaggerModule.createDocument(app, config, {
          operationIdFactory: (controllerKey, methodKey) => methodKey,
          deepScanRoutes: true,
        }),
        {
          yamlDocumentUrl: this.configService.get<string>('SWAGGER_YAML_URL', '/yaml'),
          jsonDocumentUrl: this.configService.get<string>('SWAGGER_JSON_URL', '/json'),
          swaggerOptions: {
            persistAuthorization: true,
          },
        },
      );
    }
  }
}
