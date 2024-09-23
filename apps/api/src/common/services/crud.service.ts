import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import {
  type $scopify,
  ExclusiveTuple,
  ObjectType, type ObjectTypeExpression,
  TypeSet,
} from 'dbschema/edgeql-js/typesystem';
import {
  type ComputeSelectCardinality,
  objectTypeToSelectShape,
  SelectModifiers,
} from 'dbschema/edgeql-js/select';
import { InsertShape } from '../../../dbschema/edgeql-js/insert';
import { $expr_PathNode } from '../../../dbschema/edgeql-js/path';
import { Cardinality } from 'dbschema/edgeql-js/reflection';
import * as $ from '../../../dbschema/edgeql-js/reflection';
import { $Pet, $PetλShape } from '../../../dbschema/edgeql-js/modules/default';
import { $objectTypeToTupleType } from '../../../dbschema/edgeql-js/collections';
import { $expr_Update, UpdateShape } from '../../../dbschema/edgeql-js/update';
import type * as _std from '../../../dbschema/edgeql-js/modules/std';
import { $expr_Param } from 'dbschema/edgeql-js/params';

export class CrudService {
  constructor(
    protected readonly edgedbClient: Client,
    protected readonly model: $expr_PathNode<
      TypeSet<
        ObjectType<string, $PetλShape, null, ExclusiveTuple>,
        Cardinality.Many
      >,
      null
    >,
  ) {
  }

  // todo: also ExclusiveTuple needs refinement

  async update<
    Shape extends {
      filter?: SelectModifiers['filter'];
      filter_single?: SelectModifiers<TypeSet<
        ObjectType<string, $PetλShape, null, ExclusiveTuple>,
        Cardinality.Many
      >['__element__']>['filter_single'];
      set: UpdateShape<TypeSet<
        ObjectType<string, $PetλShape, null, ExclusiveTuple>,
        Cardinality.Many
      >>;
    },
  >(
    shape: (scope: $scopify<TypeSet<
      ObjectType<string, $PetλShape, null, ExclusiveTuple>,
      Cardinality.Many
    >['__element__']>) => Readonly<Shape>,
  ) {
    return await e
      .update(this.model, shape)
      .run(this.edgedbClient);
  }

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
      (params: { items: $expr_Param<"items", $.ArrayType<$.NamedTupleType<{ name: _std.$str; }>, `array<${string}>`>, false>; }) => {
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
    Expr extends TypeSet<ObjectType<string, $.ObjectTypePointers, null, ExclusiveTuple>>, // todo: while this compiles, it won't give intellisense for the shape
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element>,
  >(id: string, shape: Readonly<Shape>) {
    return await e
      .select(this.model, (model) => ({
        ...shape,
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async findManyByIdsWithProjection<
    Expr extends TypeSet<ObjectType<string, $PetλShape, null, ExclusiveTuple>>,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
  >(ids: string[], shape: Readonly<Omit<Shape, 'filter_single'>>) {
    const query = e.select(this.model, (model) => ({
      ...shape,
      filter: e.op(
        model.id,
        'in',
        e.array_unpack(e.literal(e.array(e.str), ids)),
      ),
    }));
    return await query.run(this.edgedbClient);
  }

  // todo: find with arbitrary filter and projection
}
