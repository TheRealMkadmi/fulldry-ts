import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { CrudService, ExtractShape } from '../../common/crud.service';
import { type Client } from 'edgedb';
import { Pet } from 'dbschema/edgeql-js/modules/default';
import e, { $infer } from 'dbschema/edgeql-js';

@Injectable()
export class PetsService extends CrudService<typeof Pet> {
  constructor(
    @Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client,
  ) {
    super(Pet, edgedbClient);
  }


  async test() {
    const query = e.select(Pet, () => ({ id: true, title: true }));

    type result = $infer<typeof query>;

    return await query.run(this.edgedbClient) as ExtractShape<typeof Pet>[];
  }
}
