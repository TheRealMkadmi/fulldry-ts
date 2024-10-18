import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { $User, User } from 'dbschema/edgeql-js/modules/default';
import { PetRepository } from '../pet/pet.repository';

@Injectable()
export class UserService {
  repository: PetRepository;
  constructor(@Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client) {
    this.repository = new PetRepository(edgedbClient);
  }

  async test() {
    return await this.repository.find({
      id: '123',
      shape: (m) => ({
        ...m['*']
      })
    });
  }
}
