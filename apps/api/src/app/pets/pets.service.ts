import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { CrudService } from '../../common/crud.service';
import { $Pet, Pet } from '../../../dbschema/edgeql-js/modules/default';
import type { Client } from 'edgedb';

@Injectable()
export class PetsService extends CrudService<$Pet> {
  constructor(
    @Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client,
  ) {
    super(Pet, edgedbClient);
  }
}
