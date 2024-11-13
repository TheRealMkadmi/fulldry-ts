import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "../../generated/syntax/syntax";
import { computeSelectShapeResult, FilterSingleType, ManyCompleteProjections, ModelIdentityArray, ModelScope, ModelTypeSet, OneCompleteProjection } from "../types";
import e from '../../generated/syntax/';
import { $overload, Coerce, HKOperation } from 'fulldry-utils';


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
    new: (x: Coerce<this["_1"], unknown>) =>
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
        const T extends Coerce<this["_1"], $expr_PathNode>,
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
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <const T extends Coerce<this["_1"], $expr_PathNode>>(x: T, c: Client) => Promise<ManyCompleteProjections<T>>;
}

export const findAll = async <T>(model: T, client: Client) => {
    return await
        e.select(model, (m: any) => ({
            ...m['*']
        }))
            .run(client);
};

// _____________________________






