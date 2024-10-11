import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('pets')
export class UserController {
  constructor(private readonly service: UserService) { }

  @Get('/')
  async test() {
    return await this.service.findAll();
  }
}
