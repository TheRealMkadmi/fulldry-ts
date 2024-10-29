import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import {
    BaseType,
    computeObjectShape,
    computeTsTypeCard,
    Expression,
    TypeSet,
    $scopify,
} from '../generated/syntax/typesystem';
import {
    ComputeSelectCardinality,
    normaliseShape,
    objectTypeToSelectShape,
    SelectModifierNames,
    SelectModifiers,
} from '../generated/syntax//select';
import { InsertShape } from '../generated/syntax/insert';
import { $expr_PathNode, $linkPropify } from '../generated/syntax/path';
import { $expr_Operator, Cardinality } from '../generated/syntax/reflection';
import { UpdateShape } from '../generated/syntax/update';
import type * as _std from 'dbschema/edgeql-js/modules/std';
import { PaginateResult } from 'common';
import { Pet, User } from 'dbschema/edgeql-js/modules/default';

import __defaultExports from 'dbschema/edgeql-js/modules/default';

import { RenderFunction, ConvertTupleOfPossibleOptionsToOverloadsIntersection, ValuesTuple } from 'fulldry-utils';


type FilterSingleType = Readonly<{
    filter_single: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type FilterType = Readonly<{
    filter: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type ModelIdentity = {
    id: string;
} | null;

type ModelIdentityArray = Exclude<ModelIdentity, null>[];

type ModelTypeSet<M> = M extends $expr_PathNode<infer U, any> ? U : never;

type ModelShape<M> = ModelTypeSet<M>['__element__']['__pointers__'];

type BackLinks<M> = {
    [K in keyof ModelShape<M> as K extends `<${string}[${string}]` ? K : never]: ModelShape<M>[K];
};

type NumericFields<M> = {
    [K in keyof ModelShape<M>]: ModelShape<M>[K]['target'] extends _std.$number ? K : never;
}[keyof ModelShape<M>];

type ModelSelectShape<M> =
    objectTypeToSelectShape<ModelTypeSet<M>["__element__"]> &
    SelectModifiers<ModelTypeSet<M>["__element__"]>;

type ModelScope<M> =
    $scopify<ModelTypeSet<M>["__element__"]> &
    $linkPropify<{
        [K in keyof ModelTypeSet<M>]: K extends "__cardinality__"
        ? Cardinality.One
        : ModelTypeSet<M>[K];
    }>;

type computeSelectShapeResult<
    M,
    Shape extends ModelSelectShape<M>,
> = computeTsTypeCard<
    computeObjectShape<ModelShape<M>, normaliseShape<Shape, SelectModifierNames>>,
    ComputeSelectCardinality<ModelTypeSet<M>, Pick<Shape, SelectModifierNames>>
>;

type FilterCallable<M> = (model: ModelScope<M>) => SelectModifiers['filter'];


type OneCompleteProjection<M extends $expr_PathNode> = computeSelectShapeResult<M, M['*'] & FilterSingleType>;
type ManyCompleteProjections<M extends $expr_PathNode> = computeSelectShapeResult<M, M['*'] & FilterType>;


// _________________________________

type Exports = typeof __defaultExports;

type Models = Exports[keyof Exports];




// Define the tuple of model types for the repository
type ModelTuple = ValuesTuple<typeof __defaultExports, [keyof Exports]>;





type $overload<TFunc extends RenderFunction<any, any, any>> = ConvertTupleOfPossibleOptionsToOverloadsIntersection<ModelTuple, TFunc>


// _____________

type RenderFindAll<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(client: Client, x: T) => Promise<ManyCompleteProjections<T>>;
const findAll: $overload<RenderFindAll<Models>> = async <T>(client: Client, model: T) => {
    return await
        e.select(model, (m: any) => ({
            ...m['*']
        }))
            .run(client);
}

// _____________

type RenderFindAllIds<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(client: Client, x: T, limit?: number, offset?: number) => Promise<ModelIdentityArray>;
const findAllIds: $overload<RenderFindAllIds<Models>> =
    async <T>(client: Client, model: T, limit?: number, offset?: number) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                limit,
                offset,
            }))
            .run(client);
    }

// _____________

type RenderFindManyByIds<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
>(client: Client, x: T, ids: string[]) => Promise<ManyCompleteProjections<T>>;

const findManyByIds: $overload<RenderFindManyByIds<Models>> =
    async <T>(client: Client, model: T, ids: string[]) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                filter: e.op(
                    m.id,
                    'in',
                    e.array_unpack(e.literal(e.array(e.str), ids)),
                ),
            }))
            .run(client);
    }

// _____________

type RenderFindOneById<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode> (client: Client, x: T, id: string) => Promise<OneCompleteProjection<T>>;
const findOneById: $overload<RenderFindOneById<Models>> =
    async <T>(client: Client, model: T, id: string) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                filter_single: e.op(m.id, '=', e.literal(e.str, id)),
            }))
            .run(client);
    }

// _____________

type RenderFindOneByIdWithProjection<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>,
>(client: Client, x: T, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => Promise<computeSelectShapeResult<T, Shape & FilterSingleType>>;
const findOneByIdWithProjection: $overload<RenderFindOneByIdWithProjection<Models>> =
    async <T, Shape>(client: Client, model: T, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => {
        return await e
            .select(model, (m: any) => ({
                ...shape(m),
                filter_single: e.op(m.id, '=', e.literal(e.str, id)),
            }))
            .run(client);
    }

// _____________

// Assuming all utilities and types are already defined as per your context.

// FindByBackLink Method
type RenderFindByBackLink<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    K extends keyof BackLinks<T>
>(
    client: Client,
    model: T,
    backlink: K,
    id: string
) => Promise<ManyCompleteProjections<T>>;

const findByBackLink: $overload<RenderFindByBackLink<Models>> =
    async <T, K extends keyof BackLinks<T>>(
        client: Client,
        model: T,
        backlink: K,
        id: string
    ) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                filter: e.op(
                    m[backlink]['id'],
                    '=',
                    e.literal(e.str, id)
                ),
            }))
            .run(client);
    };

// Find Method
type RenderFind<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Shape extends ModelSelectShape<T>,
>(
    client: Client,
    model: T,
    shape: (scope: ModelScope<T>) => Readonly<Shape>
) => Promise<computeSelectShapeResult<T, Shape>>;
const find: $overload<RenderFind<Models>> =
    async <T, Shape>(
        client: Client,
        model: T & $expr_PathNode,
        shape: (scope: ModelScope<T>) => Readonly<Shape>
    ) => {
        return await e.select(model as any, shape).run(client);
    };

// Paginate Method
type RenderPaginate<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Shape extends ModelSelectShape<T>,
>(
    client: Client,
    model: T,
    shape: (scope: ModelScope<T>) => Readonly<Shape>,
    limit: number,
    offset: number
) => Promise<PaginateResult<computeSelectShapeResult<T, Shape & FilterSingleType>>>;
const paginate: $overload<RenderPaginate<Models>> =
    async <T, Shape>(
        client: Client,
        model: T & $expr_PathNode,
        shape: (scope: ModelScope<T>) => Readonly<Shape>,
        limit: number,
        offset: number
    ) => {
        const _limit = e.int64(limit);
        const _offset = e.int64(offset);

        const allItemsMatchingFilter = e.select(model as any, shape);

        const pageItems = e.select(model, (m: any) => ({
            ...shape(m),
            limit: _limit,
            offset: _offset,
        }));

        const query = e.select({
            items: pageItems,
            itemsCount: e.count(pageItems),
            totalItems: e.count(allItemsMatchingFilter),
            currentPage: e.math.ceil(e.op(_offset, '/', _limit)),
            totalPages: e.math.ceil(
                e.op(e.count(allItemsMatchingFilter), '/', _limit)
            ),
            limit: _limit,
            offset: _offset,
        });

        return await query.run(client) as any;
    };

// Count Method
type RenderCount<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Scope extends ModelScope<T>
>(
    client: Client,
    model: T,
    filter?: FilterCallable<T>
) => Promise<number>;

const count: $overload<RenderCount<Models>> =
    async <T, Scope>(
        client: Client,
        model: T,
        filter?: (scope: Scope) => SelectModifiers['filter']
    ) => {
        const query = e.select(model, (m: any) => ({
            filter: filter ? filter(m) : undefined,
        }));
        return await e.count(query).run(client);
    };

// Exists Method
type RenderExists<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Scope extends ModelScope<T>
>(
    client: Client,
    model: T,
    filter?: (scope: Scope) => SelectModifiers['filter']
) => Promise<boolean>;

const exists: $overload<RenderExists<Models>> =
    async <T, Scope>(
        client: Client,
        model: T,
        filter?: (scope: Scope) => SelectModifiers['filter']
    ) => {
        const query = e.select(model, (m: any) => ({
            filter: filter ? filter(m) : undefined,
        }));
        return (await e.count(query).run(client)) > 0;
    };

// Sum Method
type RenderSum<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Field extends NumericFields<T>
>(
    client: Client,
    model: T,
    field: Field,
    filter?: (scope: ModelScope<T>) => SelectModifiers['filter']
) => Promise<number | null>;

const sum: $overload<RenderSum<Models>> =
    async <T, Field extends NumericFields<T>>(
        client: Client,
        model: T,
        field: Field,
        filter?: (scope: ModelScope<T>) => SelectModifiers['filter']
    ) => {
        return await aggregate(client, model, field, e.sum, filter);
    };

// Min Method
type RenderMin<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Field extends NumericFields<T>
>(
    client: Client,
    model: T,
    field: Field,
    filter?: (scope: ModelScope<T>) => SelectModifiers['filter']
) => Promise<number | null>;

const min: $overload<RenderMin<Models>> =
    async <T, Field extends NumericFields<T>>(
        client: Client,
        model: T,
        field: Field,
        filter?: (scope: ModelScope<T>) => SelectModifiers['filter']
    ) => {
        return await aggregate(client, model, field, e.min, filter);
    };

// Max Method
type RenderMax<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Field extends NumericFields<T>
>(
    client: Client,
    model: T,
    field: Field,
    filter?: (scope: ModelScope<T>) => SelectModifiers['filter']
) => Promise<number | null>;

const max: $overload<RenderMax<Models>> =
    async <T, Field extends NumericFields<T>>(
        client: Client,
        model: T,
        field: Field,
        filter?: (scope: ModelScope<T>) => SelectModifiers['filter']
    ) => {
        return await aggregate(client, model, field, e.max, filter);
    };

// Aggregate Helper Function
const aggregate = async <
    T,
    Field extends NumericFields<T>
>(
    client: Client,
    model: T,
    field: Field,
    aggregation: (field: any) => any,
    filter?: (scope: ModelScope<T>) => SelectModifiers['filter']
): Promise<number | null> => {
    const query = e.select(model, (m: any) => ({
        filter: filter ? filter(m) : undefined,
        value: aggregation(m[field]),
    }));
    const retVal = await query.run(client);
    return retVal.length === 0 ? null : (retVal[0].value as number | null);
};

// Update Method
type RenderUpdate<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Shape extends {
        filter?: SelectModifiers['filter'];
        filter_single?: SelectModifiers<ModelTypeSet<T>['__element__']>['filter_single'];
        set: UpdateShape<ModelTypeSet<T>>;
    }
>(
    client: Client,
    model: T,
    shape: (scope: ModelScope<T>) => Readonly<Shape>
) => Promise<computeTsTypeCard<ModelIdentity, ComputeSelectCardinality<T, Shape>>>;

const update: $overload<RenderUpdate<Models>> =
    async <T, Shape>(
        client: Client,
        model: T & $expr_PathNode,
        shape: (scope: ModelScope<T>) => Readonly<Shape>
    ) => {
        return await e.update(model as any, shape as any).run(client);
    };

// UpdateMany Method
type RenderUpdateMany<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
>(
    client: Client,
    model: T,
    filter: FilterCallable<T>,
    set: UpdateShape<ModelTypeSet<T>>
) => Promise<computeTsTypeCard<ModelIdentity, ComputeSelectCardinality<T, FilterType>>>;

const updateMany: $overload<RenderUpdateMany<Models>> =
    async <T>(
        client: Client,
        model: T & $expr_PathNode,
        filter: FilterCallable<T>,
        set: UpdateShape<ModelTypeSet<T>>
    ) => {
        return await e
            .update(model, (m: any) => ({
                filter: filter(m),
                set,
            }))
            .run(client);
    };

// Insert Method
type RenderInsertSingle<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode
>(
    client: Client,
    model: T & $expr_PathNode,
    data: InsertShape<ModelTypeSet<T>['__element__']>
) => Promise<Exclude<ModelIdentity, null>>;

const insert: $overload<RenderInsertSingle<Models>
> = async <T>(
    client: Client,
    model: T & $expr_PathNode,
    data: InsertShape<ModelTypeSet<T>['__element__']>
) => {
        return await e.insert(model as any, data as never).run(client);
    };



type RenderInsertMultiple<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode
>(
    client: Client,
    model: T,
    data: InsertShape<ModelTypeSet<T>['__element__']>[]
) => Promise<Exclude<ModelIdentity, null>[]>;

const insertMany: $overload<RenderInsertMultiple<Models>
> = async <T>(
    client: Client,
    model: T & $expr_PathNode,
    data:
        InsertShape<ModelTypeSet<T>['__element__']>[]
) => {
        const query = e.set(...data.map((d) => e.insert(model, d)));
        return await query.run(client);
    };

// Delete Method
type RenderDeleteSingle<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode
>(
    client: Client,
    model: T,
    id: string
) => Promise<ModelIdentity>;

const deleteOne: $overload<RenderDeleteSingle<Models>> = async<T>(
    client: Client,
    model: T & $expr_PathNode,
    id: string
) => {
    return await e
        .delete(model, (m: any) => ({
            filter_single: e.op(m.id, '=', e.literal(e.str, id)),
        }))
        .run(client) as any;
}

type RenderDeleteMultiple<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode
>(
    client: Client,
    model: T & $expr_PathNode,
    ids: string[]
) => Promise<ModelIdentity[]>;

const deleteMany: $overload<RenderDeleteMultiple<Models>> = async <T>(
    client: Client,
    model: T & $expr_PathNode,
    ids: string[]
) => {
    return await e
        .delete(model, (m: any) => ({
            filter: e.op(
                m.id,
                'in',
                e.array_unpack(e.literal(e.array(e.str), ids))
            ),
        }))
        .run(client) as any;
};

// GroupBy Method
type RenderGroupBy<OneOfPossibleOptions> = <
    const T extends OneOfPossibleOptions & $expr_PathNode,
    Shape extends {
        by?: {
            [k: string]: Expression<
                TypeSet<BaseType, Cardinality.One | Cardinality.AtMostOne>
            >;
        };
    } & objectTypeToSelectShape<ModelTypeSet<T>['__element__']>
>(
    client: Client,
    model: T,
    getter: (
        arg: $scopify<ModelTypeSet<T>['__element__']>
    ) => Readonly<Shape>
) => Promise<any>;

const groupBy: $overload<RenderGroupBy<Models>> =
    async <T, Shape>(
        client: Client,
        model: T & $expr_PathNode,
        getter: (
            arg: $scopify<ModelTypeSet<T>['__element__']>
        ) => Readonly<Shape>
    ) => {
        const query = e.group(model as any, getter as any);
        const result = await query.run(client);
        return result;
    };



const test = async () => {
    const pet = await findAll(client, User);
    const petIds = await findAllIds(client, Pet, 10, 0);
    const petByIds = await findManyByIds(client, Pet, ['1', '2']);
    const petById = await findOneById(client, Pet, '1');
    const petByIdWithProjection = await findOneByIdWithProjection(client, Pet, '1', (m) => ({
        name: true,
    }));

}

