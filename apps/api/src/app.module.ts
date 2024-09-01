import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EdgeDBModule } from 'nest-edgedb';
import { SwaggerConfigService } from './common/services/swagger.service';
import { PetsModule } from './app/pets/pets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EdgeDBModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        instanceName: configService.get<string>('EDGEDB_INSTANCE'),
        secretKey: configService.get<string>('EDGEDB_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    PetsModule
  ],
  providers: [SwaggerConfigService],
})
export class AppModule  {}
