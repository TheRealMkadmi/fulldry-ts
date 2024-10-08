import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EdgeDBModule } from 'nest-edgedb';
import { SwaggerConfigService } from './common/services/swagger.service';
import { PetModule } from './app/pet/pet.module';
import { UserModule } from './app/user/user.module';

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
    PetModule,
    UserModule
  ],
  providers: [SwaggerConfigService],
})
export class AppModule  {}
