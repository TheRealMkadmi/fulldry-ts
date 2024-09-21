import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import {
  ExclusiveTuple,
  ObjectType,
  TypeSet,
} from 'dbschema/edgeql-js/typesystem';
import {
  objectTypeToSelectShape,
  SelectModifiers,
} from 'dbschema/edgeql-js/select';
import { InsertShape } from '../../../dbschema/edgeql-js/insert';
import { $expr_PathNode } from '../../../dbschema/edgeql-js/path';
import { Cardinality } from 'dbschema/edgeql-js/reflection';
import * as $ from '../../../dbschema/edgeql-js/reflection';
import type * as _schema from '../../../dbschema/edgeql-js/modules/schema';
import { $Pet, $PetλShape } from '../../../dbschema/edgeql-js/modules/default';
import { $objectTypeToTupleType } from '../../../dbschema/edgeql-js/collections';

export class CrudService<S extends $PetλShape> {
  constructor(
    protected readonly edgedbClient: Client,
    protected readonly model: $expr_PathNode<
      TypeSet<
        ObjectType<string, $PetλShape, null, ExclusiveTuple>,
        Cardinality.Many
      >,
      null
    >,
  ) {}

  async insert(
    data: InsertShape<
      ObjectType<string, Omit<$PetλShape, 'id'>, null, ExclusiveTuple>
    >,
  ) {
    return await e.insert(this.model, data).run(this.edgedbClient);
  }

  async insertMany(
    data: InsertShape<
      ObjectType<string, Omit<$PetλShape, 'id'>, null, ExclusiveTuple>
    >[],
  ) {
    const m = $objectTypeToTupleType($.$toSet($Pet, $.Cardinality.Many))[
      '__shape__'
    ];
    const query = e.params(
      {
        items: e.array(
          e.tuple({
            ...m,
          }),
        ),
      },
      (params) => {
        return e.for(e.array_unpack(params.items), (item) => {
          return e.insert(this.model, item);
        });
      },
    );

    return await query.run(this.edgedbClient, {
      // @ts-expect-error
      items: data,
    });
  }

  async findAll() {
    return await e
      .select(this.model, (m) => ({
        ...m['*'],
      }))
      .run(this.edgedbClient);
  }

  async findOneById(id: string) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async findManyByIds(ids: string[]) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
      }))
      .run(this.edgedbClient);
  }

  async findOneByIdProjection<
    Expr extends TypeSet<ObjectType<string, $.ObjectTypePointers, null, ExclusiveTuple>>,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element>,
  >(id: string, shape: Readonly<Shape>) {
    return await e
      .select(this.model, (pet) => ({
        ...shape,
        filter_single: e.op(pet.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async findManyByIdsProjection<
    Expr extends TypeSet<ObjectType<string, $PetλShape, null, ExclusiveTuple>>,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
  >(ids: string[], shape: Readonly<Omit<Shape, 'filter_single'>>) {
    const query = e.select(this.model, (pet) => ({
      ...shape,
      filter: e.op(
        pet.id,
        'in',
        e.array_unpack(e.literal(e.array(e.str), ids)),
      ),
    }));
    return await query.run(this.edgedbClient);
  }
}
