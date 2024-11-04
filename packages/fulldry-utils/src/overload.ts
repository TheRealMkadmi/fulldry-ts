// work around for: https://github.com/microsoft/TypeScript/issues/27808
// "look at what they do to mimic a fraction of our power - C#"

import { TupleToUnion, UnionToIntersection } from './transform';
import { GenericFunction } from './primitives';
import { extend } from 'fp-ts';
import { Apply, Flow, HKT } from './hkt';
import { Assume } from './lies';

export type ConvertTupleOfPossibleOptionsToOverloadsUnion<
    TupleOfPossibleOptions extends readonly any[],
    Render extends GenericFunction<any, any, any>
> = TupleOfPossibleOptions extends [infer OneOfPossibleOptions, ...infer RestOfPossibleOptions]
    ? | Render
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
declare type PossibleOptions = ['a', 'b', 'c'];
type Foo<U> = <const T extends U>(x: T) => T;
declare const method: $overload<PossibleOptions, Foo<TupleToUnion<PossibleOptions>>>;
const methodResult = method('a'); // methodResult is of type "a"

interface $TupleToUnion extends HKT {
    new: (x: Assume<this["_1"], any[]>) => TupleToUnion<Assume<this["_1"], any[]>>;
}

interface $Foo extends HKT {
    new: (x: Assume<this["_1"], any[]>) => Foo<Assume<this["_1"], any>>;
}

// Example Usage 2:
declare const method2: $overload<PossibleOptions, Apply<Flow<[$TupleToUnion, $Foo]>, PossibleOptions>>;
const method2Result = method2('b'); // method2Result is of type "b"