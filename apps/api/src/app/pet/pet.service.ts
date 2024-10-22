import { Inject, Injectable } from '@nestjs/common';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { type Client } from 'edgedb';
import { PetRepository } from './pet.repository';


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
      ...m['*']
    }), 1, 5);

  }
}
