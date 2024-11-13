import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "../../generated/syntax/syntax";
import { computeSelectShapeResult, FilterSingleType, ManyCompleteProjections, ModelIdentityArray, ModelScope, ModelTypeSet, OneCompleteProjection } from "../types";
import e from '../../generated/syntax/';
import { $overload, Coerce, HKOperation } from 'fulldry-utils';


interface $RenderFindAllIds extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) =>
        <const T extends Coerce<this["_1"], $expr_PathNode>>(x: T, limit?: number, offset?: number)
            => Promise<ModelIdentityArray>;
}


interface $RenderFindManyByIds extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>,
    >(x: T, ids: string[]) => Promise<ManyCompleteProjections<T>>;
}


interface $RenderFindOneById extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) =>
        <const T extends Coerce<this["_1"], $expr_PathNode>> (x: T, id: string)
            => Promise<OneCompleteProjection<T>>;
}

interface $RenderFindOneByIdWithProjection extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>,
        Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>,
    >(x: T, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => Promise<computeSelectShapeResult<T, Shape & FilterSingleType>>;
}


interface $RenderFindAll extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <const T extends Coerce<this["_1"], $expr_PathNode>>(x: T) => Promise<ManyCompleteProjections<T>>;
}

type MethodNames = 'findAll' | 'findAllIds' | 'findManyByIds' | 'findOneById' | 'findOneByIdWithProjection';

type ModelsTuple = [typeof e.Pet, typeof e.User];

const client = {} as Client;

const findAll: $overload<ModelsTuple, $RenderFindAll> = async <T>(model: T) => {
    return await
        e.select(model, (m: any) => ({
            ...m['*']
        }))
            .run(client);
};

const findAllIds: $overload<ModelsTuple, $RenderFindAllIds> =
    async <T>(model: T, limit?: number, offset?: number) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                limit,
                offset,
            }))
            .run(client);
    }

const findManyByIds: $overload<ModelsTuple, $RenderFindManyByIds> =
    async <T>(model: T, ids: string[]) => {
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

const findOneById: $overload<ModelsTuple, $RenderFindOneById> =
    async <T>(model: T, id: string) => {
        return await e
            .select(model, (m: any) => ({
                ...m['*'],
                filter_single: e.op(m.id, '=', e.literal(e.str, id)),
            }))
            .run(client);
    }

const findOneByIdWithProjection: $overload<ModelsTuple, $RenderFindOneByIdWithProjection> =
    async <T, Shape>(model: T, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => {
        return await e
            .select(model, (m: any) => ({
                ...shape(m),
                filter_single: e.op(m.id, '=', e.literal(e.str, id)),
            }))
            .run(client);
    }

