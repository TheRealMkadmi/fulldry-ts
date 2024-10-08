import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
  imports: [
  ],
  controllers: [
    PetController
  ],
  providers: [
    PetService
  ],
})
export class PetModule {
}
