import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { CrudService, ExtractShape } from '../../common/crud.service';
import { type Client } from 'edgedb';
import { type $Pet, Pet } from 'dbschema/edgeql-js/modules/default';
import e, { $infer } from 'dbschema/edgeql-js';

@Injectable()
export class PetsService extends CrudService<$Pet> {
  constructor(
    @Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client,
  ) {
    super(Pet, edgedbClient);
  }

  async find() {

    type t = ExtractShape<$Pet>;

  }
}
