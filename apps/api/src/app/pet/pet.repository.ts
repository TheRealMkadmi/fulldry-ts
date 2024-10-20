import { Client } from 'edgedb';
import e, { type $infer } from 'dbschema/edgeql-js';
import {
  computeObjectShape,
  computeTsTypeCard,
  ObjectType,
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

// Type Declarations
type Model = typeof Pet;

type ExtractTypeSet<T> = T extends $expr_PathNode<infer U, any> ? U : never;
type ModelTypeSet = ExtractTypeSet<Model>;
type ModelShape = ModelTypeSet['__element__']['__pointers__'];
type ModelName = ModelTypeSet['__element__']['__name__'];

type BackLinks = {
  [K in keyof ModelShape as K extends `<${string}[${string}]` ? K : never]: ModelShape[K];
};

type NumericFields = {
  [K in keyof ModelShape]: ModelShape[K]['target'] extends _std.$number ? K : never;
}[keyof ModelShape];

type ModelSelectShape = objectTypeToSelectShape<ModelTypeSet["__element__"]> & SelectModifiers<ModelTypeSet["__element__"]>;

type ModelScope = $scopify<ModelTypeSet["__element__"]> &
  $linkPropify<{
    [K in keyof ModelTypeSet]: K extends "__cardinality__"
    ? Cardinality.One
    : ModelTypeSet[K];
  }>;

type CompleteProjection = $infer<typeof selectResults>;

type FilterSingleType = Readonly<{
  filter_single: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type FilterType = Readonly<{
  filter: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type PaginateType = Readonly<{
  limit: number;
  offset: number;
}>;

type ModelIdentity = {
  id: string;
} | null;

type computeSelectShapeResult<
  Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]> & SelectModifiers<ModelTypeSet["__element__"]>,
> = computeTsTypeCard<
  computeObjectShape<ModelShape, normaliseShape<Shape, SelectModifierNames>>,
  ComputeSelectCardinality<ModelTypeSet, Pick<Shape, SelectModifierNames>>
>;

type FilterCallable = (model: ModelScope) => SelectModifiers['filter'];

// Select Results
const selectResults = e.select(Pet, (m) => ({
  ...m['*'],
  filter_single: e.op(m.id, '=', e.uuid('dummy')),
}));

export class PetRepository {
  protected readonly model: Model = Pet;

  constructor(
    protected readonly edgedbClient: Client,
  ) { }

  // Find Methods
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
      .select(this.model, () => ({
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
    Scope extends ModelScope,
  >(
    id: string,
    shape: (scope: Scope) => Readonly<Shape>,
  ): Promise<computeSelectShapeResult<Shape & FilterSingleType>> {
    const wrappedShape: (scope: Scope) => Readonly<Shape & FilterSingleType> = (scope: Scope) => ({
      ...shape(scope),
      filter_single: e.op(scope.id, '=', e.uuid(id)),
    });

    const select = e.select(this.model, wrappedShape);
    const retVal = await select.run(this.edgedbClient);

    return retVal;
  }

  async find<
    Shape extends ModelSelectShape,
    Scope extends ModelScope,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
  ): Promise<computeSelectShapeResult<Shape>> {
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
    Shape extends Omit<ModelSelectShape, 'filter'>,
    Scope extends ModelScope,
  >(
    ids: string[],
    shape: (scope: Scope) => Readonly<Shape>
  ): Promise<computeSelectShapeResult<Shape & FilterType>> {
    const wrappedShape: (scope: Scope) => Readonly<Shape & FilterType> = (scope: Scope) => ({
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

  async findByBackLink(
    backlink: keyof BackLinks,
    id: string
  ): Promise<CompleteProjection[]> {
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
    Shape extends Omit<ModelSelectShape, 'limit' | 'offset'>,
    Scope extends ModelScope,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
    limit: number,
    offset: number,
  ): Promise<computeSelectShapeResult<Shape & PaginateType>> {
    const wrappedShape: (scope: Scope) => Readonly<Shape & PaginateType> = (m: Scope) => ({
      ...shape(m),
      limit,
      offset,
    });

    return await e.select(this.model, wrappedShape).run(this.edgedbClient);
  }

  async findManyByIdsPaginate(
    ids: string[],
    limit: number,
    offset: number
  ): Promise<CompleteProjection[]> {
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
    Shape extends ModelSelectShape,
    Scope extends ModelScope,
  >(
    ids: string[],
    shape: (scope: Scope) => Readonly<Shape>,
    limit: number,
    offset: number
  ): Promise<computeSelectShapeResult<Shape & PaginateType & FilterType>> {
    const wrappedShape: (scope: Scope) => Readonly<Shape & PaginateType & FilterType> = (m: Scope) => ({
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

  async findByBackLinkPaginate(
    backlink: keyof BackLinks,
    id: string,
    limit: number,
    offset: number
  ): Promise<CompleteProjection[]> {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model[backlink]['id'],
          '=',
          e.uuid(id),
        ),
        limit,
        offset,
      }))
      .run(this.edgedbClient);
  }

  async count(
    filter?: FilterCallable,
  ): Promise<number> {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    return await e.count(query).run(this.edgedbClient);
  }

  async exists(
    filter?: FilterCallable,
  ): Promise<boolean> {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    return (await e.count(query).run(this.edgedbClient)) > 0;
  }

  async sum(
    field: NumericFields,
    filter?: FilterCallable
  ): Promise<number | null> {
    return this.aggregate(field, e.sum, filter);
  }

  async min(
    field: NumericFields,
    filter?: FilterCallable
  ): Promise<number | null> {
    return this.aggregate(field, e.min, filter);
  }

  async max(
    field: NumericFields,
    filter?: FilterCallable
  ): Promise<number | null> {
    return this.aggregate(field, e.max, filter);
  }

  private async aggregate(
    field: NumericFields,
    aggregation: (field: any) => any,
    filter?: FilterCallable
  ): Promise<number | null> {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value: aggregation(model[field]),
    }));
    const retVal = await query.run(this.edgedbClient);
    return retVal.length === 0 ? null : retVal[0].value as number | null;
  }

  async update<
    Shape extends {
      filter?: SelectModifiers['filter'];
      filter_single?: SelectModifiers<ModelTypeSet['__element__']>['filter_single'];
      set: UpdateShape<ModelTypeSet>;
    },
  >(
    shape: (
      scope: ModelScope,
    ) => Readonly<Shape>,
  ) {
    return await e.update(this.model, shape).run(this.edgedbClient);
  }

  async updateMany(
    filter: FilterCallable,
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
    data: InsertShape<ModelTypeSet['__element__']>,
  ): Promise<Exclude<ModelIdentity, null>> {
    return await e.insert(this.model, data).run(this.edgedbClient);
  }

  async insertMany(
    data: InsertShape<ModelTypeSet['__element__']>[],
  ): Promise<Exclude<ModelIdentity, null>[]> {
    const inserts = data.map((d) => e.insert(this.model, d));
    const query = e.for(e.set(...inserts), (item) => item);

    return await query.run(this.edgedbClient);
  }

  async delete(id: string): Promise<ModelIdentity> {
    return await e
      .delete(this.model, (model) => ({
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async deleteMany(ids: string[]): Promise<ModelIdentity[]> {
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
