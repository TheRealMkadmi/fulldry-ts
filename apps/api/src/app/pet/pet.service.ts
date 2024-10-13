import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { Model } from '../../common/base.model';

@Injectable()
export class PetService extends Model<'Pet'> {
  constructor(@Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client) {
    super('Pet', edgedbClient);
  }
}
