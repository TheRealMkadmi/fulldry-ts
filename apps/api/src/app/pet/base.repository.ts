import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import {
  BaseType,
  computeObjectShape,
  computeTsTypeCard,
  Expression,
  TypeSet,
  $scopify,
} from 'dbschema/edgeql-js/typesystem';
import {
  ComputeSelectCardinality,
  normaliseShape,
  objectTypeToSelectShape,
  SelectModifierNames,
  SelectModifiers,
} from 'dbschema/edgeql-js/select';
import { InsertShape } from 'dbschema/edgeql-js/insert';
import { $expr_PathNode, $linkPropify } from 'dbschema/edgeql-js/path';
import { $expr_Operator, Cardinality } from 'dbschema/edgeql-js/reflection';
import { UpdateShape } from 'dbschema/edgeql-js/update';
import type * as _std from 'dbschema/edgeql-js/modules/std';
import { PaginateResult } from 'common';
import { Pet, User } from 'dbschema/edgeql-js/modules/default';

import __defaultExports from 'dbschema/edgeql-js/modules/default';

type FilterSingleType = Readonly<{
  filter_single: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type FilterType = Readonly<{
  filter: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

type ModelIdentity = {
  id: string;
} | null;

type ModelTypeSet<M> = M extends $expr_PathNode<infer U, any> ? U : never;

type ModelShape<M> = ModelTypeSet<M>['__element__']['__pointers__'];

type BackLinks<M> = {
  [K in keyof ModelShape<M> as K extends `<${string}[${string}]` ? K : never]: ModelShape<M>[K];
};

type NumericFields<M> = {
  [K in keyof ModelShape<M>]: ModelShape<M>[K]['target'] extends _std.$number ? K : never;
}[keyof ModelShape<M>];

type ModelSelectShape<M> =
  objectTypeToSelectShape<ModelTypeSet<M>["__element__"]> &
  SelectModifiers<ModelTypeSet<M>["__element__"]>;

type ModelScope<M> =
  $scopify<ModelTypeSet<M>["__element__"]> &
  $linkPropify<{
    [K in keyof ModelTypeSet<M>]: K extends "__cardinality__"
    ? Cardinality.One
    : ModelTypeSet<M>[K];
  }>;

type computeSelectShapeResult<
  M,
  Shape extends ModelSelectShape<M>,
> = computeTsTypeCard<
  computeObjectShape<ModelShape<M>, normaliseShape<Shape, SelectModifierNames>>,
  ComputeSelectCardinality<ModelTypeSet<M>, Pick<Shape, SelectModifierNames>>
>;

type FilterCallable<M> = (model: ModelScope<M>) => SelectModifiers['filter'];


type OneCompleteProjection<M extends $expr_PathNode> = computeSelectShapeResult<M, M['*'] & FilterSingleType>;
type ManyCompleteProjections<M extends $expr_PathNode> = computeSelectShapeResult<M, M['*'] & FilterType>;


// _________________________________

const client = {} as Client;

type Models = typeof __defaultExports[keyof typeof __defaultExports];

// Define the tuple of model types for the repository
type ModelTuple = [typeof __defaultExports["User"], typeof __defaultExports["Pet"]];


type UnionToIntersection<U> =
  (U extends any ? (_: U) => void : never) extends ((_: infer I) => void) ? I : never;

type RenderFindOne<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(x: T) => Promise<OneCompleteProjection<T>>;
type RenderFindAll<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(x: T) => Promise<ManyCompleteProjections<T>>;

type RenderFunction<
  Generics extends any[] = [],
  Args extends any[] = [],
  Return = any
> = <G extends Generics, A extends Args>(...args: A) => Return;

type ConvertTupleOfPossibleOptionsToOverloadsUnion<
  TupleOfPossibleOptions extends readonly any[],
  Render extends RenderFunction<any, any, any>
> = TupleOfPossibleOptions extends [infer OneOfPossibleOptions, ...infer RestOfPossibleOptions]
  ? | Render
  | ConvertTupleOfPossibleOptionsToOverloadsUnion<RestOfPossibleOptions, Render>
  : never;

type ConvertTupleOfPossibleOptionsToOverloadsIntersection<
  TupleOfPossibleOptions extends readonly any[],
  Render extends RenderFunction<any, any, any>
> = UnionToIntersection<
  ConvertTupleOfPossibleOptionsToOverloadsUnion<
    TupleOfPossibleOptions,
    Render
  >
>;

type FindAllOverloads<T> = ConvertTupleOfPossibleOptionsToOverloadsIntersection<ModelTuple, RenderFindAll<T>>;
type FindOneOverloads<T> = ConvertTupleOfPossibleOptionsToOverloadsIntersection<ModelTuple, RenderFindOne<T>>;

// @ts-expect-error
const findAll: FindAllOverloads<T> = async <T extends $expr_PathNode>(model: T) => {
  return await e.select(model, (m: any) => ({
    ...m['*']
  })).run(client);
}
// @ts-expect-error
const findOne: FindOneOverloads<T> = async <T extends $expr_PathNode>(model: T, id: string) => {
  return await e.select(model, (m: any) => ({
    ...m['*'],
    filter_single: m.id.eq(id)
  })).run(client);
}
export const createRepository = <T>(model: T) => new class {
  async findAll() {
    return findAll(model);
  }
}

const test = async () => {
  const test = createRepository(User);
  const result = await test.findAll();
}