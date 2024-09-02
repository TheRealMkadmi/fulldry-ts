import { Controller, Get, Param } from '@nestjs/common';
import { PetsService } from './pets.service';
import { $default } from '../../../dbschema/interfaces';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {

  }

  @Get()
  async findAll(): Promise<$default.Pet[]> {
    return await this.petsService.findAll({}) as unknown as $default.Pet[];
  }

}
