// model.ts
import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import __defaultExports from 'dbschema/edgeql-js/modules/default';
import { $expr_PathNode } from 'dbschema/edgeql-js/reflection';

type EntityNames = keyof __defaultExports;
type Entities = typeof __defaultExports[EntityNames];

export class Model<K extends EntityNames> {
  private readonly model: Entities;
  private readonly client: Client;

  constructor(key: K, client: Client) {
    this.model = __defaultExports[key];
    this.client = client;
  }

  async findAll() {
    return await e
      .select(this.model, (m) => ({
        ...m['*'],
      }))
      .run(this.client);
  }
}
