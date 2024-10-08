import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('pets')
export class UserController {
  constructor(private readonly service: UserService) {}

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
