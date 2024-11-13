import { Client } from "edgedb";
import { $expr_PathNode, SelectModifiers } from "./generated/syntax/syntax";
import { ManyCompleteProjections } from "./repository/types";
import e from './generated/syntax';
import { $overload, Coerce, HKOperation } from 'fulldry-utils';
import { ObjectType, ObjectTypePointers, ExclusiveTuple } from "./generated/syntax/typesystem";


interface $RenderFindAll extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <const T extends Coerce<this["_1"], $expr_PathNode>>(x: T) => Promise<ManyCompleteProjections<T>>;
}

type ModelsTuple = [typeof e.Pet, typeof e.User];
const findAll = async <T>(model: T) => {
    return await e.select(model, (m: any) => ({
        ...m['*']
    })).run(client);
}

const t = findAll(e.Pet);

// Usage:
const client = {} as Client;


export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
}

const em = new EntityManager<ModelsTuple>();

const pets = em.findAll(e.Pet);
const users = em.findAll(e.User); 
