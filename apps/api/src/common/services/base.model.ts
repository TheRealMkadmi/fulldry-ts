import { Client } from 'edgedb';
import e, { Cardinality } from 'dbschema/edgeql-js';
import __defaultExports, { $PetλShape } from 'dbschema/edgeql-js/modules/default';
import { $expr_PathNode, LinkDesc, ObjectType, PropertyDesc, TypeSet } from 'dbschema/edgeql-js/reflection';



type ValidNameSpaceKeys = Exclude<{
  [K in keyof __defaultExports]: __defaultExports[K] extends $expr_PathNode ? K : never;
}[keyof __defaultExports], 'BaseObject' | 'Object' | 'FreeObject'>;

export class Model<
  TModelName extends ValidNameSpaceKeys = ValidNameSpaceKeys,
> {
  constructor(
    private readonly modelName: TModelName,
    private readonly client: Client,
  ) {
  }

  async findAll() {
    const model = e[this.modelName as ValidNameSpaceKeys];
    return e.select(model, (m) => ({
      ...m['*'],
    })).run(this.client);
  }

  async findOneById(id: string) {
    const model = e[this.modelName as ValidNameSpaceKeys];

    return await e
      .select(model, (model) => ({
        ...model['*'],
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.client);
  }

  async findManyByIds(ids: string[]) {
    const model = e[this.modelName as ValidNameSpaceKeys];

    return await e
      .select(model, (model) => ({
        ...model['*'],
        filter: e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
      }))
      .run(this.client);
  }


}
