import { $, Client } from 'edgedb';
import e, { Cardinality } from 'dbschema/edgeql-js';
import __defaultExports, { $Pet, $PetλShape, Pet } from 'dbschema/edgeql-js/modules/default';
import { $expr_PathNode, computeTsType, LinkDesc, ObjectType, PropertyDesc, setToTsType, TypeSet } from 'dbschema/edgeql-js/reflection';

export type ExtractTypeSet<T extends keyof __defaultExports> = keyof __defaultExports extends T ? __defaultExports[T] extends $expr_PathNode<infer U, any> ? U : never : never;
export type SelectResult<T extends keyof __defaultExports> = setToTsType<ExtractTypeSet<T>>;


export class Model<
  TModelName extends keyof __defaultExports,
> {
  constructor(
    private readonly modelName: keyof __defaultExports,
    private readonly client: Client,
  ) {
  }

  async findAll(): Promise<SelectResult<TModelName>> {
    const model = e[this.modelName];
    return await e
      .select(model, (m) => ({
        ...m['*'],
      }))
      .run(this.client) as SelectResult<TModelName>;
  }
}

