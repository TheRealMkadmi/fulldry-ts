import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerConfigService } from './common/services/swagger.service';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  // while this is sore to the eyes, it aligns with NestJS’s philosophy of keeping modules
  // clean and using the main bootstrap file (main.ts) for application-level configuration
  const swaggerConfigService = app.get(SwaggerConfigService);
  swaggerConfigService.initSwagger(app);


  await app.listen(process.env.API_PORT || 8080);
}
bootstrap();


