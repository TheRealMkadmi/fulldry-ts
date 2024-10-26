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


type CompleteProjection<M extends $expr_PathNode> = computeSelectShapeResult<M, M['*'] & FilterSingleType>;


// _________________________________

const client = {} as Client;

type Models = typeof __defaultExports[keyof typeof __defaultExports];

// Define the tuple of model types for the repository
type ModelTuple = [typeof __defaultExports["User"], typeof __defaultExports["Pet"]];


type UnionToIntersection<U> =
  (U extends any ? (_: U) => void : never) extends ((_: infer I) => void) ? I : never;

// Defines how each function overload will look
type Render<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(x: T) => Promise<CompleteProjection<T>>;


// Recursively converts a tuple of options into a union of overloads
type TupleToUnion<
  TupleOfPossibleOptions,
  RenderFn
> = TupleOfPossibleOptions extends [infer OneOfPossibleOptions, ...infer RestOfPossibleOptions]
  ? RenderFn extends Render<infer R>
  ? Render<R & OneOfPossibleOptions> | TupleToUnion<RestOfPossibleOptions, RenderFn>
  : never
  : never;

// Converts the union of overloads into an intersection type
type $overloadMethod<
  TupleOfPossibleOptions,
  RenderFn extends Render<any>
> = UnionToIntersection<
  TupleToUnion<TupleOfPossibleOptions, RenderFn>
>;

type SelectOverloads<T> = $overloadMethod<ModelTuple, Render<T>>;

// @ts-expect-error
const select: SelectOverloads<T> = async <T extends $expr_PathNode>(model: T) => {
  return await e.select(model, (m: any) => ({
    ...m['*']
  })).run(client);
}

const test = async () => {
  const user = await select(User);
  const pet = await select(Pet);
}