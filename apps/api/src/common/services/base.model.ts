import { $, Client } from 'edgedb';
import e, { Cardinality } from 'dbschema/edgeql-js';
import __defaultExports, { $Pet, $PetλShape, Pet } from 'dbschema/edgeql-js/modules/default';
import { $expr_PathNode, computeTsType, LinkDesc, ObjectType, PropertyDesc, setToTsType, TypeSet } from 'dbschema/edgeql-js/reflection';

export type Entities = __defaultExports[keyof __defaultExports];

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;

type IsExactly<T, U> = Equal<T, U> extends true ? T : never;


export class Model<T extends Entities> {
  constructor(
    private readonly model: IsExactly<T, Entities>,
    private readonly client: Client,
  ) {
  }

  async findAll() {
    return await e
      .select(this.model as T, (m) => ({
        ...m['*'],
      }))
      .run(this.client);
  }
}

