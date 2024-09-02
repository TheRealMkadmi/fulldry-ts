import { Controller, Get, Param } from '@nestjs/common';
import { PetsService } from './pets.service';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {


  }

  @Get()
  async findAll() {
    return await this.petsService.findAll({

    });
  }

}
