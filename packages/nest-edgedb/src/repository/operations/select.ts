import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "../../generated/syntax/syntax";
import { computeSelectShapeResult, FilterSingleType, ManyCompleteProjections, ModelIdentityArray, ModelScope, ModelTypeSet, OneCompleteProjection } from "../types";
import e from '../../generated/syntax/';
import { $overload, Coerce, createAbstraction, HKOperation } from 'fulldry-utils';


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

export class EntityManager<
    Models extends $expr_PathNode[],
> {
    constructor(
        private readonly client: Client,
    ) { }

    // @ts-expect-error
    findAll: $overload<Models, $RenderFindAll> = async <T>(model: T) => {
        return await
            e.select(model, (m: any) => ({
                ...m['*']
            }))
                .run(client);
    }


    // @ts-expect-error
    findAllIds: $overload<Models, $RenderFindAllIds> =
        async <T>(model: T, limit?: number, offset?: number) => {
            return await e
                .select(model, (m: any) => ({
                    ...m['*'],
                    limit,
                    offset,
                }))
                .run(this.client);
        }

    // @ts-expect-error
    findManyByIds: $overload<Models, $RenderFindManyByIds> =
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
                .run(this.client);
        }
    // @ts-expect-error
    findOneById: $overload<Models, $RenderFindOneById> =
        async <T>(model: T, id: string) => {
            return await e
                .select(model, (m: any) => ({
                    ...m['*'],
                    filter_single: e.op(m.id, '=', e.literal(e.str, id)),
                }))
                .run(client);
        }

    // @ts-expect-error
    findOneByIdWithProjection: $overload<Models, $RenderFindOneByIdWithProjection> =
        async <T, Shape>(model: T, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => {
            return await e
                .select(model, (m: any) => ({
                    ...shape(m),
                    filter_single: e.op(m.id, '=', e.literal(e.str, id)),
                }))
                .run(client);
        }

    getRepository<T extends Models[number]>(model: T): Repository<T> {
        const self: any = this;
        return {
            findAll: () => self.findAll(model),
            findAllIds: (limit?: number, offset?: number) => self.findAllIds(model, limit, offset),
            findManyByIds: (ids: string[]) => self.findManyByIds(model, ids),
            findOneById: (id: string) => self.findOneById(model, id),
            findOneByIdWithProjection: (id, shape) => self.findOneByIdWithProjection(model, id, shape),
        };
    }
}


interface Repository<T extends $expr_PathNode> {
    findAll(): Promise<ManyCompleteProjections<T>>;
    findAllIds(limit?: number, offset?: number): Promise<ModelIdentityArray>;
    findManyByIds(ids: string[]): Promise<ManyCompleteProjections<T>>;
    findOneById(id: string): Promise<OneCompleteProjection<T>>;
    findOneByIdWithProjection<Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>>(
        id: string,
        shape: (scope: ModelScope<T>) => Readonly<Shape>
    ): Promise<computeSelectShapeResult<T, Shape & FilterSingleType>>;
}


const client = {} as Client;
type ModelsTuple = [typeof e.Pet];

const entityManager = new EntityManager<ModelsTuple>(client);
const test = entityManager.findAll(e.Pet); // Promise<{ id: string; name: string; }[]>

const r = entityManager.getRepository(e.Pet);
const test2 = r.findAll(); // Promise<{ id: string; name: string; }[]>