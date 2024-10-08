import { Controller, Get, Param } from '@nestjs/common';
import { PetService } from './pet.service';

@Controller('pets')
export class PetController {
  constructor(private readonly service: PetService) {}

  @Get('/')
  async test() {
    return await this.service.findAll();
  }

  @Get('/')
  async test2() {
    return await this.service.findOneById(
      '1e3d12d7-630a-11ef-ab07-9531a2453419',
    );
  }
}
