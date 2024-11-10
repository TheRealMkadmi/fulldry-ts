// workaround for https://github.com/microsoft/typeScript/issues/1213

import {Coerce} from "./lies";
import {GenericFunction} from "./primitives";
import {Reverse} from "./tuples";

export abstract class HKOperation {
    readonly _1?: unknown;
    new!: GenericFunction<any, any, any>;
}

export type Apply<F extends HKOperation, _1> = ReturnType<
    (F & {
        readonly _1: _1;
    })["new"]
>;

export type Map<X extends readonly unknown[], F extends HKOperation> = {
    [K in keyof X]: Apply<F, X[K]>;
};

export type Reduce<HKTs extends HKOperation[], X> = HKTs extends []
    ? X
    : HKTs extends [infer Head, ...infer Tail]
    ? Apply<Coerce<Head, HKOperation>, Reduce<Coerce<Tail, HKOperation[]>, X>>
    : never;

interface Compose<HKTs extends HKOperation[]> extends HKOperation {
    new: (x: this["_1"]) => Reduce<HKTs, this["_1"]>;
}

export interface Chain<HKTs extends HKOperation[]> extends HKOperation {
    new: (x: this["_1"]) => Reduce<Reverse<HKTs>, this["_1"]>;
}
