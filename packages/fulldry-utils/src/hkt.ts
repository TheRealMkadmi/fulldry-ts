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