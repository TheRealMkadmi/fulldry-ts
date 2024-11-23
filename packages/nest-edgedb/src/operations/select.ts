import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "../generated/syntax/syntax";
import { BackLinks, computeSelectShapeResult, FilterCallable, FilterSingleType, ManyCompleteProjections, ModelIdentityArray, ModelScope, ModelSelectShape, ModelTypeSet, OneCompleteProjection } from "./types";
import e from '../generated/syntax';
import { Coerce, HKOperation } from 'fulldry-utils';
import { PaginateResult } from "packages/common/src/types/pagination";


export interface $RenderFindAllIds extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) =>
        <const T extends Coerce<this["_1"], $expr_PathNode>>(x: T, limit?: number, offset?: number)
            => Promise<ModelIdentityArray>;
}

export const findAllIds =
    async <T>(model: T, client: Client, limit?: number, offset?: number) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                limit,
                offset,
            }))
            .run(client);
    }


// _____________________________

export interface $RenderFindManyByIds extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>,
    >(x: T, client: Client, ids: string[]) => Promise<ManyCompleteProjections<T>>;
}

export const findManyByIds =
    async <T>(model: T, client: Client, ids: string[]) => {
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

// _____________________________

export interface $RenderFindOneById extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) =>
        <const T extends Coerce<this["_1"], $expr_PathNode>> (x: T, client: Client, id: string)
            => Promise<OneCompleteProjection<T>>;
}

export const findOneById =
    async <T>(model: T, client: Client, id: string) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                filter_single: e.op(m.id, '=', e.literal(e.str, id)),
            }))
            .run(client);
    }

// _____________________________

export interface $RenderFindOneByIdWithProjection extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends $expr_PathNode,
        Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>,
    >(x: T, client: Client, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => Promise<computeSelectShapeResult<T, Shape & FilterSingleType>>;
}

export const findOneByIdWithProjection =
    async <T, Shape>(model: T, client: Client, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => {
        return await e
            .select(model, (m: any) => ({
                ...shape(m),
                filter_single: e.op(m.id, '=', e.literal(e.str, id)),
            }))
            .run(client);
    }

// _____________________________

export interface $RenderFindAll extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) =>
        <const T extends Coerce<this["_1"], $expr_PathNode>>(x: T, c: Client) => Promise<ManyCompleteProjections<T>>;
}

export const findAll = async <T>(model: T, client: Client) => {
    return await
        e.select(model, (m: any) => ({
            ...m['*']
        }))
            .run(client);
};

// _____________________________






// _____________________________

export interface $RenderFindByBackLink extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>,
        K extends keyof BackLinks<T>
    >(
        client: Client,
        model: T,
        backlink: K,
        id: string
    ) => Promise<ManyCompleteProjections<T>>;
}

export const findByBackLink = async <T, K extends keyof BackLinks<T>>(
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

// _____________________________

export interface $RenderFind extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>,
        Shape extends ModelSelectShape<T>
    >(
        client: Client,
        model: T,
        shape: (scope: ModelScope<T>) => Readonly<Shape>
    ) => Promise<computeSelectShapeResult<T, Shape>>;
}

export const find = async <T, Shape>(
    client: Client,
    model: T & $expr_PathNode,
    shape: (scope: ModelScope<T>) => Readonly<Shape>
) => {
    return await e.select(model as any, shape).run(client);
};

// _____________________________

export interface $RenderPaginate extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>,
        Shape extends ModelSelectShape<T>
    >(
        client: Client,
        model: T,
        shape: (scope: ModelScope<T>) => Readonly<Shape>,
        limit: number,
        offset: number
    ) => Promise<PaginateResult<computeSelectShapeResult<T, Shape & FilterSingleType>>>;
}

export const paginate = async <T, Shape>(
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

// _____________________________

export interface $RenderCount extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>
    >(
        client: Client,
        model: T,
        filter?: FilterCallable<T>
    ) => Promise<number>;
}

export const count = async <T>(
    client: Client,
    model: T,
    filter?: FilterCallable<T>
) => {
    const query = e.select(model, (m: any) => ({
        filter: filter ? filter(m) : undefined,
    }));
    return await e.count(query).run(client);
};

// _____________________________

export interface $RenderExists extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>
    >(
        client: Client,
        model: T,
        filter?: FilterCallable<T>
    ) => Promise<boolean>;
}

export const exists = async <T>(
    client: Client,
    model: T,
    filter?: FilterCallable<T>
) => {
    const query = e.select(model, (m: any) => ({
        filter: filter ? filter(m) : undefined,
    }));
    return (await e.count(query).run(client)) > 0;
};

// _____________________________
