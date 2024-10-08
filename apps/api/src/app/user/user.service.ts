import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { Model } from '../../common/services/base.model';

@Injectable()
export class UserService extends Model<'User'> {
  constructor(@Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client) {
    super('User', edgedbClient);
  }
}
