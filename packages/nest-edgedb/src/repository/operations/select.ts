import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "../../generated/syntax/syntax";
import { computeSelectShapeResult, FilterSingleType, ManyCompleteProjections, ModelIdentityArray, ModelScope, ModelTypeSet, OneCompleteProjection } from "../types";
import e from '../../generated/syntax/';
import { $overload, Coerce, HKOperation } from 'fulldry-utils';


interface $RenderFindAll extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <const T extends Coerce<this["_1"], unknown> & $expr_PathNode>(x: T) => Promise<ManyCompleteProjections<T>>;
}


interface $RenderFindAllIds extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <const T extends Coerce<this["_1"], unknown> & $expr_PathNode>(x: T, limit?: number, offset?: number) => Promise<ModelIdentityArray>;
}



interface $RenderFindManyByIds extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends Coerce<this["_1"], unknown> & $expr_PathNode,
    >(x: T, ids: string[]) => Promise<ManyCompleteProjections<T>>;
}


interface $RenderFindOneById extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) =>
        <const T extends Coerce<this["_1"], unknown> & $expr_PathNode> (x: T, id: string)
            => Promise<OneCompleteProjection<T>>;
}


interface $RenderFindOneByIdWithProjection extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends Coerce<this["_1"], unknown>,
        Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>,
    >(x: T, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => Promise<computeSelectShapeResult<T, Shape & FilterSingleType>>;
}

class Wrapper<Models extends $expr_PathNode[]> {
    constructor(
        private readonly client: Client,
    ) { }
    // @ts-expect-error
    findAll: $overload<Models, $RenderFindAll> =
        async <T>(model: T) => {
            return await
                e.select(model, (m: any) => ({
                    ...m['*']
                }))
                    .run(this.client);
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
        async <T>(client: Client, model: T, id: string) => {
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
}
const client = {} as Client;
type ModelsTuple = [typeof e.Pet];
const nam = new Wrapper<ModelsTuple>(client);
const r = nam.findAll(e.Pet);
const f = nam.findAllIds(e.Pet);
const g = nam.findManyByIds(e.Pet, ['1', '2']);
const h = nam.findOneById(e.Pet, '1');
const i = nam.findOneByIdWithProjection(e.Pet, '1', (m) => ({
    name: true,
}));

