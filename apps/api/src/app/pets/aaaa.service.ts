import { Client } from 'edgedb';
import e, { Cardinality } from 'dbschema/edgeql-js';
import __defaultExports, { $PetλShape } from 'dbschema/edgeql-js/modules/default';
import { $expr_PathNode, LinkDesc, ObjectType, PropertyDesc, TypeSet } from 'dbschema/edgeql-js/reflection';
import { shape } from 'dbschema/edgeql-js/select';
import { $str, $uuid } from 'dbschema/edgeql-js/modules/std';
import { $ObjectType } from 'dbschema/edgeql-js/modules/schema';

// export type ModelNames = Exclude<keyof __defaultExports, 'BaseObject' | 'Object' | 'FreeObject'>;
// type SchemaShape = {
//   id: PropertyDesc<$uuid, Cardinality, true, false, true, true>;
//   __type__: LinkDesc<$ObjectType, Cardinality, {}, false, false, true, false>;
//   name: PropertyDesc<$str, Cardinality, false, false, false, false>;
// }
type ValidNameSpaceKeys = Exclude<{
  [K in keyof __defaultExports]: __defaultExports[K] extends $expr_PathNode ? K : never;
}[keyof __defaultExports], 'BaseObject' | 'Object' | 'FreeObject'>;

// type NamespaceToShape<NameSpace extends ValidNameSpaceKeys> =
//   (__defaultExports)[NameSpace] extends $expr_PathNode<TypeSet<infer P extends ObjectType<string, SchemaShape>, Cardinality>, null>
//   ? P
//   : never;


export class BB<
  TModelName extends ValidNameSpaceKeys = ValidNameSpaceKeys,
> {
  constructor(
    private readonly modelName: TModelName,
    private readonly client: Client,
  ) { }

  async findAll() {
    const model = e[this.modelName as ValidNameSpaceKeys];
    return e.select(model).run(this.client);
  }

  async findOneById(id: string) {
    const model = e[this.modelName as 'Pet'];
    return await e
      .select(model, (model) => ({
        ...model['*'],
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.client);
  }

  async findOneByIdProjection(id: string, projection: Record<keyof typeof e[TModelName], boolean>) {
    const model = e[this.modelName  as ValidNameSpaceKeys];
    return await e
      .select(model, (model) => ({
        ...shape,
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.client);
  }
}
