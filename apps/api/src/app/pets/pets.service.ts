import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { CrudService } from '../../common/services/crud.service';
import { type Client } from 'edgedb';
import { $Pet, Pet } from 'dbschema/edgeql-js/modules/default';
import e from 'dbschema/edgeql-js';

@Injectable()
export class PetsService extends CrudService<$Pet> {
  constructor(@Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client) {
    super(edgedbClient, e.Pet);
  }

  async test() {
    const query = await e
      .select(e.Pet, (pet) => ({
        name: true,
      }))
      .run(this.edgedbClient);
  }
}
