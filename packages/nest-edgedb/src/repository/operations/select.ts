import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "../../generated/syntax/syntax";
import { computeSelectShapeResult, ManyCompleteProjections, ModelScope, ModelTypeSet, OneCompleteProjection } from "../types";
import e from '../../generated/syntax/';
import { $overload, Coerce, HKOperation } from 'fulldry-utils';


type RenderFindAll<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(x: T) => Promise<ManyCompleteProjections<T>>;
interface $RenderFindAll extends HKOperation {
    new: (x: Coerce<this["_1"], any>) => RenderFindAll<Coerce<this["_1"], any>>;
}

type ModelsTuple = [typeof e.User, typeof e.Pet];

const findAll: $overload<ModelsTuple, $RenderFindAll> = async <T>(model: T) => {
    return await
        e.select(model, (m: any) => ({
            ...m['*']
        }))
            .run({} as Client);
}

const r = findAll(e.Pet);

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
    const T extends OneOfPossibleOptions,
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