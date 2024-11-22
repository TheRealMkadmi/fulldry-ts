import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "./generated/syntax/syntax";
import e from './generated/syntax';
import { $overload, Equal, Expect } from 'fulldry-utils';
import { $RenderFindAll, $RenderFindOneById, $RenderFindOneByIdWithProjection, findAll, findOneById, findOneByIdWithProjection } from "./repository/operations/select";
import { ModelScope, ModelTypeSet } from "./repository/types";





const client = {} as Client;


export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
    findOneByIdWithProjection: $overload<TModels, $RenderFindOneByIdWithProjection> = findOneByIdWithProjection as any
    findOneById: $overload<TModels, $RenderFindOneById> = findOneById as any
}


type NarrowEntityManager<T extends $expr_PathNode> = EntityManager<[T]>;

type MethodNames<ClassType> = {
    [K in keyof ClassType]: ClassType[K] extends (...args: any[]) => any ? K : never;
}[keyof ClassType];
type EntityManagerMethodNames<T extends $expr_PathNode> = MethodNames<NarrowEntityManager<T>>;
type EntityManagerMethod<TModel extends $expr_PathNode, TMethod extends EntityManagerMethodNames<TModel>> = NarrowEntityManager<TModel>[TMethod];

// ________

const em2 = new EntityManager<[typeof e.Pet]>();

const petWithProj = em2.findOneByIdWithProjection(e.Pet, client, '1', (m) => ({
    age: true
}));

type FunctionSignature = ReturnType<$RenderFindOneByIdWithProjection["new"]>;

// ______________

declare const test: FunctionSignature;
//               ^? <const T extends $expr_PathNode, Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>>(x: T, client: Client, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => Promise<computeSelectShapeResult<T, Shape & FilterSingleType>>


type ConcreteFunc<T extends $expr_PathNode, Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>> = typeof test<T, Shape>;

declare const m: ConcreteFunc<typeof e.Pet, { age: true }>;

const k = m.bind(em2, e.Pet, client);

const l = m(e.Pet, client, '1', (m) => ({
    age: true
}));

const n = k('1', (m) => ({
    age: true
}));

type o = Expect<Equal<typeof l, typeof n>>;

// ______________

