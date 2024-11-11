import { Client } from 'edgedb';
import e, { type $infer } from 'dbschema/edgeql-js';
import {
  BaseType,
  computeObjectShape,
  computeTsTypeCard,
  Expression,
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
import { $expr_Operator, Cardinality } from 'dbschema/edgeql-js/reflection';
import { Pet } from '../../../dbschema/edgeql-js/modules/default';
import { UpdateShape } from '../../../dbschema/edgeql-js/update';
import type * as _std from '../../../dbschema/edgeql-js/modules/std';
import { PaginateResult } from 'common';

// Type Declarations
type Model = typeof Pet;


type ExtractTypeSet<T> = T extends $expr_PathNode<infer U, any> ? U : never;
type ModelTypeSet = ExtractTypeSet<Model>;
type ModelShape = ModelTypeSet['__element__']['__pointers__'];

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


type FilterSingleType = Readonly<{
  filter_single: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type FilterType = Readonly<{
  filter: $expr_Operator<_std.$bool, Cardinality.One>;
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

type CompleteProjection = computeSelectShapeResult<Model['*'] & FilterSingleType>


export class PetRepository {
  protected readonly model: Model = Pet;

  constructor(
    protected readonly edgedbClient: Client,
  ) { }

  // Find Methods
  async findAll(limit?: number, offset?: number): Promise<CompleteProjection[]> {
    return await e
      .select(this.model, (m) => ({
        ...m['*'],
        limit,
        offset,
      }))
      .run(this.edgedbClient);
  }

  async findAllIds(limit?: number, offset?: number): Promise<ModelIdentity[]> {
    return await e
      .select(this.model, () => ({
        limit,
        offset,
      }))
      .run(this.edgedbClient);
  }

  async findOneById(id: string): Promise<CompleteProjection>;
  async findOneById<
    Shape extends objectTypeToSelectShape<ModelTypeSet["__element__"]>,
    Scope extends ModelScope,
  >(
    id: string,
    shape: (scope: Scope) => Readonly<Shape>,
  ): Promise<computeSelectShapeResult<Shape & FilterSingleType>>;
  async findOneById(
    id: string,
    shape?: (scope: any) => any,
  ): Promise<any> {
    if (shape) {
      const wrappedShape = (scope: any) => ({
        ...shape(scope),
        filter_single: e.op(scope.id, '=', e.uuid(id)),
      });
      const select = e.select(this.model, wrappedShape);
      const retVal = await select.run(this.edgedbClient);
      return retVal;
    } else {
      return await e
        .select(this.model, (model) => ({
          ...model['*'],
          filter_single: e.op(model.id, '=', e.uuid(id)),
        }))
        .run(this.edgedbClient);
    }
  }

  async findManyByIds(ids: string[]): Promise<CompleteProjection[]>;
  async findManyByIds<
    Shape extends Omit<ModelSelectShape, 'filter'>,
    Scope extends ModelScope,
  >(
    ids: string[],
    shape: (scope: Scope) => Readonly<Shape>
  ): Promise<computeSelectShapeResult<Shape & FilterType>>;
  async findManyByIds(
    ids: string[],
    shape?: (scope: any) => any,
  ): Promise<any> {
    if (shape) {
      const wrappedShape = (scope: any) => ({
        ...shape(scope),
        filter: e.op(
          scope.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
      });
      const query = e.select(this.model, wrappedShape);
      return await query.run(this.edgedbClient);
    } else {
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

  async find<
    Shape extends ModelSelectShape,
    Scope extends ModelScope,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
  ): Promise<computeSelectShapeResult<Shape>> {
    return await e.select(this.model, shape).run(this.edgedbClient);
  }

  // Pagination Method
  async paginate<
    Shape extends ModelSelectShape,
    Scope extends ModelScope,
  >(
    shape: (scope: ModelScope) => Readonly<Shape>,
    limit: number,
    offset: number,
  ): Promise<PaginateResult<computeSelectShapeResult<Shape & FilterSingleType>>> {
    const _limit = e.int64(limit);
    const _offset = e.int64(offset);

    const allItemsMatchingFilter = e.select(this.model, shape);

    const pageItems = e.select(this.model, (m) => ({
      ...shape(m),
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
    return r as unknown as PaginateResult<computeSelectShapeResult<Shape & FilterSingleType>>;
  }

  // Aggregation Methods
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

  // Update Methods
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

  // Insert Methods
  async insert(
    data: InsertShape<ModelTypeSet['__element__']>,
  ): Promise<Exclude<ModelIdentity, null>>;
  async insert(
    data: InsertShape<ModelTypeSet['__element__']>[],
  ): Promise<Exclude<ModelIdentity, null>[]>;
  async insert(
    data: InsertShape<ModelTypeSet['__element__']> | InsertShape<ModelTypeSet['__element__']>[],
  ): Promise<any> {
    if (Array.isArray(data)) {
      const query = e.set(...data.map(d => e.insert(this.model, d)));
      return await query.run(this.edgedbClient);
    } else {
      return await e.insert(this.model, data).run(this.edgedbClient);
    }
  }

  // Delete Methods
  async delete(id: string): Promise<ModelIdentity>;
  async delete(ids: string[]): Promise<ModelIdentity[]>;
  async delete(idOrIds: string | string[]): Promise<any> {
    if (Array.isArray(idOrIds)) {
      return await e
        .delete(this.model, (model) => ({
          filter: e.op(
            model.id,
            'in',
            e.array_unpack(e.literal(e.array(e.str), idOrIds)),
          ),
        }))
        .run(this.edgedbClient);
    } else {
      return await e
        .delete(this.model, (model) => ({
          filter_single: e.op(model.id, '=', e.uuid(idOrIds)),
        }))
        .run(this.edgedbClient);
    }
  }

  // GroupBy Method
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