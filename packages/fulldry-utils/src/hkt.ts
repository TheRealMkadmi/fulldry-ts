import { Assume } from "./lies";

type GenericFunction = (...x: never[]) => unknown;

export abstract class HKT {
    readonly _1?: unknown;
    new!: GenericFunction;
}

export type Apply<F extends HKT, _1> = ReturnType<
    (F & {
        readonly _1: _1;
    })["new"]
>;

type MapTuple<X extends readonly unknown[], F extends HKT> = {
    [K in keyof X]: Apply<F, X[K]>;
};

type InferredType = string | number | boolean | object | undefined | null;

type InferredTuple = InferredType[] | ReadonlyArray<InferredType>;

type InstanceOf<T> = T extends new (...args: any) => infer R ? R : never;

export declare function map<X extends InferredTuple, F extends typeof HKT>(
    x: readonly [...X],
    f: F
): MapTuple<X, Assume<InstanceOf<F>, HKT>>;

export const append = <S extends string>(s: S) =>
    class extends HKT {
        new = (x: Assume<this["_1"], string>) => `${x}${s}` as const;
    };

type SimpleCompose<
    HKT1 extends HKT,
    HKT2 extends HKT,
    X
> = Apply<HKT1, Apply<HKT2, X>>;

type Reduce<HKTs extends HKT[], X> = HKTs extends []
    ? X
    : HKTs extends [infer Head, ...infer Tail]
    ? Apply<Assume<Head, HKT>, Reduce<Assume<Tail, HKT[]>, X>>
    : never;

interface Compose<HKTs extends HKT[]> extends HKT {
    new: (x: this["_1"]) => Reduce<HKTs, this["_1"]>;
}

type Reverse<T extends unknown[]> = T extends []
    ? []
    : T extends [infer U, ...infer Rest]
    ? [...Reverse<Rest>, U]
    : never;

export interface Flow<HKTs extends HKT[]> extends HKT {
    new: (x: this["_1"]) => Reduce<Reverse<HKTs>, this["_1"]>;
}
