import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { BaseRepository } from 'src/common/services/base.model';
import { $User, User } from 'dbschema/edgeql-js/modules/default';

@Injectable()
export class UserService extends BaseRepository<typeof User> {
  constructor(@Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client) {
    super(User, edgedbClient);
  }

  async findAll() {
    return await super.findAll();
  }
}
