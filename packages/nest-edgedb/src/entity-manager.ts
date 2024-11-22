import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape, SelectModifiers } from "./generated/syntax/syntax";
import e from './generated/syntax';
import { $overload, Equal, Expect, GenericFunction, HKOperation } from 'fulldry-utils';
import { $RenderFindAll, $RenderFindOneById, $RenderFindOneByIdWithProjection, findAll, findOneById, findOneByIdWithProjection } from "./repository/operations/select";
import { call } from "ramda";
import { Pet } from "./generated/syntax/modules/default";
import { ModelScope, ModelTypeSet } from "./repository/types";


type ModelsTuple = [typeof e.Pet, typeof e.User];

const client = {} as Client;


export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
    findOneByIdWithProjection: $overload<TModels, $RenderFindOneByIdWithProjection> = findOneByIdWithProjection as any
    findOneById: $overload<TModels, $RenderFindOneById> = findOneById as any
}

const em = new EntityManager<ModelsTuple>();

type NarrowEntityManager<T extends $expr_PathNode> = EntityManager<[T]>;

type MethodNames<ClassType> = {
    [K in keyof ClassType]: ClassType[K] extends (...args: any[]) => any ? K : never;
}[keyof ClassType];
type EntityManagerMethodNames<T extends $expr_PathNode> = MethodNames<NarrowEntityManager<T>>;

type EntityManagerMethod<TModel extends $expr_PathNode, TMethod extends EntityManagerMethodNames<TModel>> = NarrowEntityManager<TModel>[TMethod];
type MethodSpecificArgs<TModel extends $expr_PathNode, TMethod extends EntityManagerMethodNames<TModel>> = Parameters<EntityManagerMethod<TModel, TMethod>>;

type SliceFirstTwo<Tuple> = Tuple extends [infer _, infer __, ...infer Rest] ? Rest : never;
type ElidedMethodSpecificArgs<TModel extends $expr_PathNode, TMethod extends EntityManagerMethodNames<TModel>> = SliceFirstTwo<MethodSpecificArgs<TModel, TMethod>>;





function wrapFindAll<T extends $expr_PathNode, R>(firstArg: T, secondArg: Client, func: (x: T, c: Client, ...args: ElidedMethodSpecificArgs<T, 'findAll'>) => R) {
    return function (...newArgs: ElidedMethodSpecificArgs<T, 'findAll'>) {
        return func(firstArg, secondArg, ...newArgs);
    }
}

const r = wrapFindAll(e.Pet, client, em.findAll);

const pets1 = r();
const pets = em.findAll(e.Pet, client)
type _ = Expect<Equal<typeof pets, typeof pets1>>


// ___________


const wrapFindOne =
    <T extends $expr_PathNode, R>
        (firstArg: T, secondArg: Client, func: (x: T, c: Client, ...args: ElidedMethodSpecificArgs<T, 'findOneById'>) => R) =>
        (id: string) => func(firstArg, secondArg, id);

const rOne = wrapFindOne(e.Pet, client, em.findOneById);

const pet1 = em.findOneById(e.Pet, client, '1');
const pet = rOne('1');
type __ = Expect<Equal<typeof pet, typeof pet1>>


// ________

const em2 = new EntityManager<[typeof e.Pet]>();

const petWithProj = em2.findOneByIdWithProjection(e.Pet, client, '1', (m) => ({
    age: true
}));

const wrappedAuto = <
    Shape extends objectTypeToSelectShape<ModelTypeSet<typeof e.Pet>["__element__"]>
>(
    id: string,
    shape: (scope: ModelScope<typeof e.Pet>) => Readonly<Shape>
) => em2.findOneByIdWithProjection(e.Pet, client, id, shape);


// Usage
const petWithProjAuto1 = wrappedAuto('1', (m) => ({
    age: m.age
}));

// Type assertion to ensure types match
type ___ = Expect<Equal<typeof petWithProj, typeof petWithProjAuto1>>;

