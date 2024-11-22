import { Client } from "edgedb";
import { $expr_PathNode } from "./generated/syntax/syntax";
import e from './generated/syntax';
import { $overload } from 'fulldry-utils';
import { $RenderFindAll, $RenderFindOneById, $RenderFindOneByIdWithProjection, findAll, findOneById, findOneByIdWithProjection } from "./repository/operations/select";

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


type FunctionSignature = ReturnType<$RenderFindOneByIdWithProjection["new"]>;



declare const test: FunctionSignature;
//               ^? <const T extends $expr_PathNode, Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>>(x: T, client: Client, id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => Promise<computeSelectShapeResult<T, Shape & FilterSingleType>>


type m = ReturnType<typeof test<typeof e.Pet, { age: true }>>;


