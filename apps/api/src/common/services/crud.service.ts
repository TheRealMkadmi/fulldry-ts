import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import { LinkDesc, ObjectType, PropertyDesc, setToTsType, TypeSet } from 'dbschema/edgeql-js/typesystem';
import { $expr_PathNode, Cardinality } from 'dbschema/edgeql-js/reflection';
import { $uuid } from 'dbschema/edgeql-js/modules/std';
import { $ObjectType } from 'dbschema/edgeql-js/modules/schema';
import { type $Pet } from 'dbschema/edgeql-js/modules/default';

type StdObjectShape = {
    id: PropertyDesc<$uuid, Cardinality.One, true, false, true, true>;
    __type__: LinkDesc<$ObjectType, Cardinality.One, {}, false, false, true, false>;
};

type DefaultExclusives = [
  {
    id: {
      __element__: $uuid;
      __cardinality__: Cardinality.One | Cardinality.AtMostOne;
    };
  }
]

type r = setToTsType<TypeSet<$Pet, Cardinality.Many>>; 

type ExtractShape<T> = T extends ObjectType<string, infer S, any, any> ? S : never;
type ExtractExclusives<T> = T extends ObjectType<any, any, any, infer E> ? E : never;

export class CrudService<
  R extends ObjectType<string, K, null, E>,
  K extends StdObjectShape = ExtractShape<R>, 
  E extends DefaultExclusives = ExtractExclusives<R>,
> {
  constructor(
    protected readonly edgedbClient: Client,
    protected readonly model: $expr_PathNode<TypeSet<ObjectType<string, StdObjectShape, null, DefaultExclusives>, Cardinality.Many>, null>,
  ) { 

  }

  async findAll() {
    return await e.select(this.model).run(this.edgedbClient);
  }

  async findOne(id: string) {
    return await e
      .select(
        this.model,
        (model) => ({
          ...model['*'],
          filter_single: e.op(model.id, '=', e.uuid(id))
        }),

      )
      .run(this.edgedbClient);
  }
}

