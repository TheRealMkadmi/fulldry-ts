import { Client } from 'edgedb';
import e, { type $infer } from 'dbschema/edgeql-js';
import {
  computeObjectShape,
  computeTsTypeCard,
  ObjectType,
  setToTsType,
  type $scopify,
} from 'dbschema/edgeql-js/typesystem';
import {
  $expr_Select,
  ComputeSelectCardinality,
  normaliseShape,
  objectTypeToSelectShape,
  SelectModifierNames,
  SelectModifiers,
} from 'dbschema/edgeql-js/select';
import { InsertShape } from '../../../dbschema/edgeql-js/insert';
import { $expr_PathNode, $linkPropify } from '../../../dbschema/edgeql-js/path';
import { $expr_Operator, Cardinality } from 'dbschema/edgeql-js/reflection';
import { Pet } from '../../../dbschema/edgeql-js/modules/default';
import { UpdateShape } from '../../../dbschema/edgeql-js/update';
import type * as _std from '../../../dbschema/edgeql-js/modules/std';

type Model = typeof Pet;

type ExtractTypeSet<T> = T extends $expr_PathNode<infer U, any> ? U : never;
type ModelTypeSet = ExtractTypeSet<Model>;
type ModelShape = ModelTypeSet['__element__']['__pointers__']
type ModelName = ModelTypeSet['__element__']['__name__'];

type BackLinks = {
  [K in keyof ModelShape as K extends `<${string}[${string}]` ? K : never]: ModelShape[K];
};

type NumericFields = {
  [K in keyof ModelShape]: ModelShape[K]['target'] extends _std.$number ? K : never;
}[keyof ModelShape];


// Select results
const selectResults = e.select(Pet, (m) => ({ ...m['*'], filter_single: e.op(m.id, '=', e.uuid('dummy')) }));
type CompleteProjection = $infer<typeof selectResults>;

type ShapedSelect<
  Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]> & SelectModifiers<ModelTypeSet["__element__"]>,
> = $expr_Select<{
  __element__: ObjectType<ModelName, ModelShape, normaliseShape<Shape, SelectModifierNames>>
  __cardinality__: ComputeSelectCardinality<ModelTypeSet, Pick<Shape, SelectModifierNames>>;
}>;

type FilterSingleType = Readonly<{
  filter_single: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type FilterType = Readonly<{
  filter: $expr_Operator<_std.$bool, Cardinality.Many>;
}>;

type computeSelectShapeResult<
  Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]> & SelectModifiers<ModelTypeSet["__element__"]>,
> = computeTsTypeCard<
  computeObjectShape<ModelShape, normaliseShape<Shape>>,
  ComputeSelectCardinality<ModelTypeSet, Pick<Shape, SelectModifierNames>>
>

export class PetRepository {
  protected readonly model: Model = Pet;
  constructor(
    protected readonly edgedbClient: Client,
  ) { }

  async findAll(limit?: number, offset?: number) {
    return await e
      .select(this.model, (m) => ({
        ...m['*'],
        limit,
        offset,
      }))
      .run(this.edgedbClient);
  }

  async findAllIds(limit?: number, offset?: number) {
    return await e
      .select(this.model, (model) => ({
        ...model,
        limit,
        offset,
      }))
      .run(this.edgedbClient);
  }

  async findOneById(id: string): Promise<CompleteProjection> {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async findOneByIdProjection<
    Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]>,
    Scope extends $scopify<ModelTypeSet["__element__"]> &
    $linkPropify<{
      [k in keyof ModelTypeSet]: k extends "__cardinality__"
      ? Cardinality.One
      : ModelTypeSet[k];
    }>,
  >(
    id: string,
    shape: (scope: Scope) => Readonly<Shape>,
  ): Promise<computeSelectShapeResult<Shape & FilterSingleType>> {

    const wrappedShape: (scope: Scope) => Readonly<Shape & FilterSingleType> = (scope: Scope) => ({
      ...shape(scope),
      filter_single: e.op(scope.id, '=', e.uuid(id)),
    });

    const select = e
      .select(this.model, (m: Scope) => ({
        ...wrappedShape(m),
      }));
    const retVal = await select.run(this.edgedbClient);

    return retVal;
  }

  async find<
    Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]> & SelectModifiers<ModelTypeSet["__element__"]>,
    Scope extends $scopify<ModelTypeSet["__element__"]> &
    $linkPropify<{
      [k in keyof ModelTypeSet]: k extends "__cardinality__"
      ? Cardinality.One
      : ModelTypeSet[k];
    }>,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
  ) {
    return await e.select(this.model, shape).run(this.edgedbClient);
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

  async findManyByIdsWithProjection<
    Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]> & Omit<SelectModifiers<ModelTypeSet["__element__"]>, 'filter'>,
    Scope extends $scopify<ModelTypeSet["__element__"]> &
    $linkPropify<{
      [k in keyof ModelTypeSet]: k extends "__cardinality__"
      ? Cardinality.One
      : ModelTypeSet[k];
    }>
  >(
    ids: string[],
    shape: (scope: Scope) => Readonly<Shape>
  ) {

    const wrappedShape = (scope: Scope) => ({
      ...shape(scope),
      filter: e.op(
        scope.id,
        'in',
        e.array_unpack(e.literal(e.array(e.str), ids)),
      ),
    });

    const query = e.select(this.model, wrappedShape);
    return await query.run(this.edgedbClient);
  }

  async findByBackLink(backlink: keyof BackLinks, id: string) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model[backlink]['id'],
          '=',
          e.uuid(id),
        ),
      }))
      .run(this.edgedbClient);
  }


  async findPaginate<
    Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]> & Omit<SelectModifiers<ModelTypeSet["__element__"]>, 'limit' | 'offset'>,
    Scope extends $scopify<ModelTypeSet["__element__"]> &
    $linkPropify<{
      [k in keyof ModelTypeSet]: k extends "__cardinality__"
      ? Cardinality.One
      : ModelTypeSet[k];
    }>,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
    limit: number,
    offset: number,
  ) {
    const wrappedShape = (m: Scope) => ({
      ...shape(m),
      limit,
      offset,
    });

    return await e.select(this.model, wrappedShape).run(this.edgedbClient);
  }

  async findManyByIdsPaginate(ids: string[], limit: number, offset: number) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
        limit,
        offset,
      }))
      .run(this.edgedbClient);
  }



  async findManyByIdsWithProjectionPaginate<
    Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]> & SelectModifiers<ModelTypeSet["__element__"]>,
    Scope extends $scopify<ModelTypeSet["__element__"]> &
    $linkPropify<{
      [k in keyof ModelTypeSet]: k extends "__cardinality__"
      ? Cardinality.One
      : ModelTypeSet[k];
    }>
  >(
    ids: string[],
    shape: (scope: Scope) => Readonly<Omit<Shape, 'filter_single'>>,
    limit: number,
    offset: number
  ) {
    const wrappedShape = (m: Scope) => ({
      ...shape(m),
      filter: e.op(
        m.id,
        'in',
        e.array_unpack(e.literal(e.array(e.str), ids)),
      ),
      limit,
      offset,
    });

    const query = e.select(this.model, wrappedShape);
    return await query.run(this.edgedbClient);
  }

  async findByBackLinkPaginate(backlink: keyof BackLinks, id: string, limit: number, offset: number) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model[backlink]['id'],
          '=',
          e.uuid(id),
        ),
        limit: limit,
        offset: offset,
      }))
      .run(this.edgedbClient);
  }

  async count(
    filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter'],
  ): Promise<number> {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    return await e.count(query).run(this.edgedbClient);
  }

  async exists(
    filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter'],
  ): Promise<boolean> {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    return await e.count(query).run(this.edgedbClient) > 0;
  }

  async increment(
    id: string,
    field: NumericFields,
    value: number = 1,
  ) {
    return await e
      .update(this.model, (model) => ({
        filter_single: e.op(model.id, '=', e.uuid(id)),
        set: {
          [field]: e.op(model[field], '+', value),
        },
      }))
      .run(this.edgedbClient);
  }

  async decrement(
    id: string,
    field: NumericFields,
    value: number = 1,
  ) {
    return await e
      .update(this.model, (model) => ({
        filter_single: e.op(model.id, '=', e.uuid(id)),
        set: {
          [field]: e.op(model[field], '-', value),
        },
      }))
      .run(this.edgedbClient);
  }

  async sum(field: NumericFields, filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter']) {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value: e.sum(model[field]),
    }));
    return await query.run(this.edgedbClient);
  }

  async min(field: NumericFields, filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter']) {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value: e.min(model[field]),
    }));
    return await query.run(this.edgedbClient);
  }

  async max(field: NumericFields, filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter']) {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value: e.max(model[field]),
    }));
    return await query.run(this.edgedbClient);
  }

  async update<
    Shape extends {
      filter?: SelectModifiers['filter'];
      filter_single?: SelectModifiers<ModelTypeSet['__element__']>['filter_single'];
      set: UpdateShape<ModelTypeSet>;
    },
  >(
    shape: (
      scope: $scopify<ModelTypeSet['__element__']
      >,
    ) => Readonly<Shape>,
  ) {
    return await e.update(this.model, shape).run(this.edgedbClient);
  }

  async updateMany(
    filter: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter'],
    set: UpdateShape<ModelTypeSet>,
  ) {
    return await e
      .update(this.model, (model) => ({
        filter: filter(model),
        set,
      }))
      .run(this.edgedbClient);
  }

  async insert(
    data: InsertShape<ModelTypeSet['__element__']
    >,
  ) {
    return await e.insert(this.model, data).run(this.edgedbClient);
  }

  async insertMany(
    data: InsertShape<ModelTypeSet['__element__']>[],
  ) {
    const inserts = data.map((d) => e.insert(this.model, d));
    // By iterating inside your query using e.for, you’re guaranteed everything will happen in a single query.
    const query = e.for(e.set(...inserts), (item) => {
      return item;
    });

    return await query.run(this.edgedbClient);
  }

  async delete(id: string) {
    return await e
      .delete(this.model, (model) => ({
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async deleteMany(ids: string[]) {
    return await e
      .delete(this.model, (model) => ({
        filter: e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
      }))
      .run(this.edgedbClient);
  }
}
