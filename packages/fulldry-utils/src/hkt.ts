// workaround for https://github.com/microsoft/typeScript/issues/1213

import { Assume, InstanceOf } from "./lies";
import { InferredTuple } from "./primitives";

export type GenericFunction = (...x: never[]) => unknown;

export abstract class HKT {
    readonly _1?: unknown;
    new!: GenericFunction;
}

export type Apply<F extends HKT, _1> = ReturnType<
    (F & {
        readonly _1: _1;
    })["new"]
>;

export type MapTuple<X extends readonly unknown[], F extends HKT> = {
    [K in keyof X]: Apply<F, X[K]>;
};

export type Reduce<HKTs extends HKT[], X> = HKTs extends []
    ? X
    : HKTs extends [infer Head, ...infer Tail]
    ? Apply<Assume<Head, HKT>, Reduce<Assume<Tail, HKT[]>, X>>
    : never;

interface Compose<HKTs extends HKT[]> extends HKT {
    new: (x: this["_1"]) => Reduce<HKTs, this["_1"]>;
}

export type Reverse<T extends unknown[]> = T extends []
    ? []
    : T extends [infer U, ...infer Rest]
    ? [...Reverse<Rest>, U]
    : never;

export interface Flow<HKTs extends HKT[]> extends HKT {
    new: (x: this["_1"]) => Reduce<Reverse<HKTs>, this["_1"]>;
}
