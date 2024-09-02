import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { CrudService } from '../../common/crud.service';
import { $Pet, Pet } from 'dbschema/edgeql-js/modules/default';
import type { Client } from 'edgedb';
import e, { $infer } from 'dbschema/edgeql-js';
import * as console from 'node:console';

@Injectable()
export class PetsService extends CrudService<$Pet> {
  constructor(
    @Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client,
  ) {
    super(Pet, edgedbClient);
  }

  async findByName(name: string) {
    const query = e.select(e.Pet, () => ({
      id: true,
      name: true,
    }));

    const k = await query.run(this.edgedbClient);
    console.table(k);
    return k;
  }
}
