import { Controller, Get, Param } from '@nestjs/common';
import { PetsService } from './pets.service';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get('/')
  async test() {
    return await this.petsService.findAll();
  }

  @Get('/')
  async test2() {
    return await this.petsService.findOneById(
      '1e3d12d7-630a-11ef-ab07-9531a2453419',
    );
  }

  async nam() {
    return await this.petsService.findOneByIdProjection('nam', {
      name: true,
    });
  }
}
