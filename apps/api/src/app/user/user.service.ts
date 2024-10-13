import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { Model } from '../../common/services/base.model';
import { Pet } from 'dbschema/edgeql-js/modules/default';

@Injectable()
export class UserService extends Model<'Pet'> {
  constructor(@Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client) {
    super('Pet', edgedbClient);
  }

  async findAll() {



    return await super.findAll();
  }
}
