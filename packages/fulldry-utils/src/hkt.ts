// Utility Types
type Assume<T, U> = T extends U ? T : U;

type GenericFunction = (...args: never[]) => unknown;

// Abstract HKT Class
abstract class _HKT {
    readonly _1?: unknown;
    new?: GenericFunction;
}

type HKT = Required<_HKT>;

// Apply Utility
type Apply<F extends HKT, _1> = ReturnType<
    (F & {
        readonly _1: _1;
    })["new"]
>;

// Type A: Applies F to Options
type A<Options, F extends HKT> = Apply<F, Options>;

// Example HKT: Append Suffix
interface AppendSuffix extends HKT {
    new: (x: Assume<this["_1"], string>) => `${typeof x}_suffix`;
}

// Using Type A to Apply AppendSuffix to a String
type Result = A<"example", AppendSuffix>;
// Result is "example_suffix"

type MapTuple<X extends readonly unknown[], F extends HKT> = {
    [K in keyof X]: Apply<F, X[K]>;
};

// ["hellohello", "worldworld"]
type MapResult = MapTuple<["hello", "world"], AppendSuffix>;

interface DoubleString extends HKT {
    new: (x: Assume<this["_1"], string>) => `${typeof x}${typeof x}`;
}

interface Append<S extends string> extends HKT {
    new: (x: Assume<this["_1"], string>) => `${typeof x}${S}`;
}

interface SimpleCompose<_1 extends HKT, _2 extends HKT> extends HKT {
    new: (x: this["_1"]) => Apply<_1, Apply<_2, this["_1"]>>;
}

type ExclaimThenDouble = SimpleCompose<DoubleString, Append<"! ">>;

// "hello! hello!"
type SimpleComposeValue = Apply<ExclaimThenDouble, "hello">;

type Reduce<HKTs extends HKT[], X> = HKTs extends []
    ? X
    : HKTs extends [infer Head, ...infer Tail]
    ? Apply<Assume<Head, HKT>, Reduce<Assume<Tail, HKT[]>, X>>
    : never;

interface Compose<HKTs extends HKT[]> extends HKT {
    new: (x: this["_1"]) => Reduce<HKTs, this["_1"]>;
}

type MyProcess = Compose<[Append<"goodbye!">, DoubleString, Append<"! ">]>;

// "hi! hi! goodbye!"
type MyProcessResult = Apply<MyProcess, "hi">;

type Reverse<T extends unknown[]> = T extends []
    ? []
    : T extends [infer U, ...infer Rest]
    ? [...Reverse<Rest>, U]
    : never;

interface Flow<HKTs extends HKT[]> extends HKT {
    new: (x: this["_1"]) => Reduce<Reverse<HKTs>, this["_1"]>;
}

type MyFlow = Flow<[Append<"! ">, DoubleString, Append<"goodbye!">]>;

// "hi! hi! goodbye!"
type MyFlowResult = Apply<MyFlow, "hi">;