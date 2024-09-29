import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { type $Pet, $PetλShape, Pet } from 'dbschema/edgeql-js/modules/default';
import e from 'dbschema/edgeql-js';
import { BB } from './aaaa.service';

@Injectable()
export class PetsService extends BB<'Pet'> {
  constructor(@Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client) {
    super('Pet', edgedbClient);
  }

  async test() {
    const query = await e
      .select(e.Pet, (pet) => ({
        name: true,
      }))
      .run(this.edgedbClient);
  }
}
