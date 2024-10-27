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

type ModelIdentityArray = Exclude<ModelIdentity, null>[];

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

type $overload<TFunc extends RenderFunction<any, any, any>> = ConvertTupleOfPossibleOptionsToOverloadsIntersection<ModelTuple, TFunc>


// _____________

type RenderFindAll<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(client: Client, x: T) => Promise<ManyCompleteProjections<T>>;
const findAll: $overload<RenderFindAll<Models>> = async <T>(client: Client, model: T) => {
  return await
    e.select(model, (m: any) => ({
      ...m['*']
    }))
      .run(client);
}

// _____________

type RenderFindAllIds<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions & $expr_PathNode>(client: Client, x: T, limit?: number, offset?: number) => Promise<ModelIdentityArray>;
const findAllIds: $overload<RenderFindAllIds<Models>> =
  async <T>(client: Client, model: T, limit?: number, offset?: number) => {
    return await e
      .select(model, (m: any) => ({
        ...m['*'],
        limit,
        offset,
      }))
      .run(client);
  }

// _____________

type RenderFindByIds<OneOfPossibleOptions> = <
  const T extends OneOfPossibleOptions & $expr_PathNode,
>(client: Client, x: T, ids: string[]) => Promise<ManyCompleteProjections<T>>;

const findByIds: $overload<RenderFindByIds<Models>> =
  async <T>(client: Client, model: T, ids: string[]) => {
    return await e
      .select(model, (m: any) => ({
        ...m['*'],
        filter: e.op(
          m.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
      }))
      .run(client);
  }





const test = async () => {
  const pet = await findAll(client, User);
  const petIds = await findAllIds(client, Pet, 10, 0);
  const petByIds = await findByIds(client, Pet, ['1', '2']);

}

