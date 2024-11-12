import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { PetRepository } from './pet.repository';
import e from 'dbschema/edgeql-js';
import { BaseRepository, ValidNameSpaceKeys } from './base.repository';
import { Pet } from 'dbschema/edgeql-js/modules/default';

@Injectable()
export class PetService {
  protected repository: PetRepository;

  constructor(
    @Inject(EDGE_DB_CLIENT) private readonly client: Client,
  ) {
    this.repository = new PetRepository(this.client);
  }

  async getAll() {
    const k = await this.repository.paginate((m) => ({
      filter: e.op(m.age, '>', 5),
      age: true
    }), 1, 5);

  }

  async test() {


    const nam = new PetRepository({} as Client);

    const k = await nam.findAll();

    const tesss = await nam.findByBackLink('<pets[is User]', '1');
  }
}
