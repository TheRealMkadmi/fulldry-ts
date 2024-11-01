import { $expr_Operator } from '../generated/syntax/funcops';
import type * as _std from '../generated/syntax/modules/std';
import {
  $expr_PathNode,
  $scopify,
  Cardinality,
  computeObjectShape,
  computeTsTypeCard,
} from '../generated/syntax/reflection';
import {
  ComputeSelectCardinality,
  normaliseShape,
  objectTypeToSelectShape,
  SelectModifierNames,
  SelectModifiers,
} from '../generated/syntax/select';
import { $linkPropify } from '../generated/syntax/path';


export type FilterSingleType = Readonly<{
  filter_single: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

export type FilterType = Readonly<{
  filter: $expr_Operator<_std.$bool, Cardinality.One>;
}>;

export type ModelIdentity = {
  id: string;
} | null;

export type ModelIdentityArray = Exclude<ModelIdentity, null>[];

export type ModelTypeSet<M> = M extends $expr_PathNode<infer U, any> ? U : never;

export type ModelShape<M> = ModelTypeSet<M>['__element__']['__pointers__'];

export type BackLinks<M> = {
  [K in keyof ModelShape<M> as K extends `<${string}[${string}]` ? K : never]: ModelShape<M>[K];
};

export type NumericFields<M> = {
  [K in keyof ModelShape<M>]: ModelShape<M>[K]['target'] extends _std.$number ? K : never;
}[keyof ModelShape<M>];

export type ModelSelectShape<M> =
  objectTypeToSelectShape<ModelTypeSet<M>["__element__"]> &
  SelectModifiers<ModelTypeSet<M>["__element__"]>;

export type ModelScope<M> =
  $scopify<ModelTypeSet<M>["__element__"]> &
  $linkPropify<{
    [K in keyof ModelTypeSet<M>]: K extends "__cardinality__"
      ? Cardinality.One
      : ModelTypeSet<M>[K];
  }>;

export type computeSelectShapeResult<
  M,
  Shape extends ModelSelectShape<M>,
> = computeTsTypeCard<
  computeObjectShape<ModelShape<M>, normaliseShape<Shape, SelectModifierNames>>,
  ComputeSelectCardinality<ModelTypeSet<M>, Pick<Shape, SelectModifierNames>>
>;

export type FilterCallable<M> = (model: ModelScope<M>) => SelectModifiers['filter'];


export type OneCompleteProjection<M extends $expr_PathNode> = computeSelectShapeResult<M, M['*'] & FilterSingleType>;
export type ManyCompleteProjections<M extends $expr_PathNode> = computeSelectShapeResult<M, M['*'] & FilterType>;
