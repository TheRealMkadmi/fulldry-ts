import { Client } from 'edgedb';
import e, { type $infer } from 'dbschema/edgeql-js';
import {
  BaseType,
  computeObjectShape,
  computeTsTypeCard,
  Expression,
  ObjectType,
  TypeSet,
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
import { $expr_Literal, $expr_Operator, Cardinality } from 'dbschema/edgeql-js/reflection';
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

type ModelSelectShape =
  objectTypeToSelectShape<ModelTypeSet["__element__"]> &
  SelectModifiers<ModelTypeSet["__element__"]>;

type ModelScope =
  $scopify<ModelTypeSet["__element__"]> &
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

type Int64 = $expr_Literal<Omit<_std.$number, "__tsconsttype__"> & { __tsconsttype__: number; }>;

type PaginateType = Readonly<{
  limit: Int64;
  offset: Int64;
}>;

type ModelIdentity = {
  id: string;
} | null;

type computeSelectShapeResult<
  Shape extends ModelSelectShape,
> = computeTsTypeCard<
  computeObjectShape<ModelShape, normaliseShape<Shape, SelectModifierNames>>,
  ComputeSelectCardinality<ModelTypeSet, Pick<Shape, SelectModifierNames>>
>;

type FilterCallable = (model: ModelScope) => SelectModifiers['filter'];

export interface PaginateResult<T> {
  items: T;
  itemsCount: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
}

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
    Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]>, // no select modifiers allowed
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

  async paginate<
    Shape extends ModelSelectShape,
    Scope extends ModelScope,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
    limit: number,
    offset: number,
  ): Promise<PaginateResult<computeSelectShapeResult<Shape & FilterSingleType>>> {
    const _limit = e.int64(limit);
    const _offset = e.int64(offset);


    const allItemsMatchingFilter = e.select(this.model, shape);

    const pageItems = e.select(this.model, (m) => ({
      ...shape(m as Scope),
      limit: _limit,
      offset: _offset,
    }));

    const query = e.select({
      items: pageItems,
      itemsCount: e.count(pageItems),
      totalItems: e.count(allItemsMatchingFilter),
      currentPage: e.math.ceil(e.op(_offset, '/', _limit)),
      totalPages: e.math.ceil(e.op(e.count(allItemsMatchingFilter), '/', _limit)),
      limit: _limit,
      offset: _offset,
    });

    const r = await query.run(this.edgedbClient);
    // Weird type assertion. I know. It's not to make the compiler happy, but to make the user happy.
    return r as unknown as PaginateResult<computeSelectShapeResult<Shape & FilterSingleType>>;
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

  async groupBy<
    Shape extends {
      by?: {
        [k: string]: Expression<
          TypeSet<BaseType, Cardinality.One | Cardinality.AtMostOne>
        >
      }
    } & objectTypeToSelectShape<
      ModelTypeSet["__element__"]
    >,
  >(
    getter: (arg: $scopify<ModelTypeSet["__element__"]>) => Readonly<Shape>,
  ) {
    const query = e.group(this.model, getter);
    const result = await query.run(this.edgedbClient);
    return result;
  }
}
