// workaround for: https://github.com/microsoft/TypeScript/issues/27808
// look at what they do to mimic a fraction of our power - C#

import { TupleToUnion, UnionToIntersection } from './transform';
import { GenericFunction } from './primitives';
import { Apply, Flow, HKT } from './hkt';
import { Assume } from './lies';

type ConvertTupleOfPossibleOptionsToOverloadsUnion<
    TupleOfPossibleOptions extends readonly any[],
    Render extends GenericFunction<any, any, any>
> = TupleOfPossibleOptions extends [infer OneOfPossibleOptions, ...infer RestOfPossibleOptions]
    ? | Render // weird flex but okay
    | ConvertTupleOfPossibleOptionsToOverloadsUnion<RestOfPossibleOptions, Render>
    : never;

export type $overload<
    TAgainst extends readonly any[],
    TFunc extends GenericFunction<any, any, any>
> = UnionToIntersection<
    ConvertTupleOfPossibleOptionsToOverloadsUnion<
        TAgainst,
        TFunc
    >
>

// Example usage 1:
declare type PossibleOptions = ['a', 'b', 'c', 'd'];
type Foo<U> = <const T extends U>(x: T) => T;
declare const method: $overload<PossibleOptions, Foo<TupleToUnion<PossibleOptions>>>;
const methodResult = method('a'); // methodResult is of type "a"

// Example usage 2 (with HKTs for a better DX)
interface $TupleToUnion extends HKT {
    new: (x: Assume<this["_1"], any[]>) => TupleToUnion<Assume<this["_1"], any[]>>;
}

interface $Foo extends HKT {
    new: (x: Assume<this["_1"], any>) => Foo<Assume<this["_1"], any>>;
}

interface OverloadFactory<TOptions extends readonly any[]> extends HKT {
    new: (x: Assume<this["_1"], HKT & { new: GenericFunction<any, any, any> }>) => $overload<
        TOptions,
        Apply<
            Flow<[
                $TupleToUnion,
                Assume<this["_1"], HKT & { new: GenericFunction<any, any, any> }>
            ]>,
            TOptions
        >
    >;
}

declare const method3: Apply<OverloadFactory<PossibleOptions>, $Foo>;
const method3Result2 = method3('d'); // method3Result2 is of type "d"

