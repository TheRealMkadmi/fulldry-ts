import { $expr_PathNode, insert, update } from "./generated/syntax/syntax";
import { $overload } from 'fulldry-utils';
import { $RenderCount, $RenderExists, $RenderFind, $RenderFindAll, $RenderFindAllIds, $RenderFindManyByIds, $RenderFindOneById, $RenderFindOneByIdWithProjection, $RenderPaginate, count, exists, findAll, findAllIds, findManyByIds, findOneById, findOneByIdWithProjection } from "./operations/select";
import { sum, min, max } from "ramda";
import { $RenderSum, $RenderMin, $RenderMax } from "./operations/aggregate";
import { $RenderDeleteSingle, deleteOne, $RenderDeleteMultiple, deleteMany } from "./operations/delete";
import { $RenderGroup, group } from "./operations/group";
import { $RenderInsertSingle, $RenderInsertMultiple, insertMany } from "./operations/insert";
import { $RenderUpdate, $RenderUpdateMany, updateMany } from "./operations/update";

export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
    findOneByIdWithProjection: $overload<TModels, $RenderFindOneByIdWithProjection> = findOneByIdWithProjection as any
    findOneById: $overload<TModels, $RenderFindOneById> = findOneById as any;
    findAllIds: $overload<TModels, $RenderFindAllIds> = findAllIds as any;
    findManyByIds: $overload<TModels, $RenderFindManyByIds> = findManyByIds as any;
    find: $overload<TModels, $RenderFind> = findAll as any;
    paginate: $overload<TModels, $RenderPaginate> = findAll as any;

    sum: $overload<TModels, $RenderSum> = sum as any;
    min: $overload<TModels, $RenderMin> = min as any;
    max: $overload<TModels, $RenderMax> = max as any;
    group: $overload<TModels, $RenderGroup> = group as any;
    count: $overload<TModels, $RenderCount> = count as any;
    exists: $overload<TModels, $RenderExists> = exists as any;

    insert: $overload<TModels, $RenderInsertSingle> = insert as any;
    insertMany: $overload<TModels, $RenderInsertMultiple> = insertMany as any;

    update: $overload<TModels, $RenderUpdate> = update as any;
    updateMany: $overload<TModels, $RenderUpdateMany> = updateMany as any;

    deleteOne: $overload<TModels, $RenderDeleteSingle> = deleteOne as any;
    deleteMany: $overload<TModels, $RenderDeleteMultiple> = deleteMany as any;
}

export type NarrowEntityManager<T extends $expr_PathNode> = EntityManager<[T]>;

