import { Client } from "edgedb";
import { $expr_PathNode, SelectModifiers } from "./generated/syntax/syntax";
import e from './generated/syntax';
import { $overload, GenericFunction } from 'fulldry-utils';
import { $RenderFindAll, $RenderFindOneById, $RenderFindOneByIdWithProjection, findAll, findOneById, findOneByIdWithProjection } from "./repository/operations/select";
import { flow } from 'fp-ts/lib/function';
import R = require("types-ramda");
import { keys } from 'ts-transformer-keys';

type ModelsTuple = [typeof e.Pet, typeof e.User];

const client = {} as Client;

const t = findAll(e.Pet, client);

export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
    findOneByIdWithProjection: $overload<TModels, $RenderFindOneByIdWithProjection> = findOneByIdWithProjection as any
    findOneById: $overload<TModels, $RenderFindOneById> = findOneById as any
}

const em = new EntityManager<ModelsTuple>();

const users = em.findAll(e.Pet, client);
const petNames = em.findOneByIdWithProjection(e.Pet, client, '1', (m) => ({
    name: m.name
}));


function wrapFindAll<T extends $expr_PathNode, R>(firstArg: T, secondArg: Client, func: (x: T, c: Client, ...args: readonly unknown[]) => R) {
    return function (...newArgs: unknown[]) {
        return func(firstArg, secondArg, ...newArgs);
    }
}

const r = wrapFindAll(e.Pet, client, em.findAll);

const pets = r();


// ___________


const wrapFindOne =
    <T extends $expr_PathNode, R>
        (firstArg: T, secondArg: Client, func: (x: T, c: Client, ...args: readonly [string]) => R) => (id: string) => func(firstArg, secondArg, id);

const rOne = wrapFindOne(e.Pet, client, em.findOneById);

const pes = rOne('1');

// ______

