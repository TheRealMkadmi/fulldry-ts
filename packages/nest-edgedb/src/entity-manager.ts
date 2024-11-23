import { Client } from "edgedb";
import { $expr_PathNode } from "./generated/syntax/syntax";
import { $overload } from 'fulldry-utils';
import { $RenderFindAll, $RenderFindOneById, $RenderFindOneByIdWithProjection, findAll, findOneById, findOneByIdWithProjection } from "./operations/select";

export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
    findOneByIdWithProjection: $overload<TModels, $RenderFindOneByIdWithProjection> = findOneByIdWithProjection as any
    findOneById: $overload<TModels, $RenderFindOneById> = findOneById as any
}


export type NarrowEntityManager<T extends $expr_PathNode> = EntityManager<[T]>;

