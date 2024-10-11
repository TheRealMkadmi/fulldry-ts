import { Controller, Get, Param } from '@nestjs/common';
import { PetService } from './pet.service';

@Controller('pets')
export class PetController {
  constructor(private readonly service: PetService) { }

  @Get('/')
  async test() {
    return await this.service.findAll();
  }
}
