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
    return this.repository.findOneByIdProjection("test", (m) => ({
      name: true
    }))
  }
}
