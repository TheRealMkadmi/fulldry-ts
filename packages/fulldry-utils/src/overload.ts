// workaround for: https://github.com/microsoft/TypeScript/issues/27808
// look at what they do to mimic a fraction of our power - C#

import { TupleToUnion, UnionToIntersection } from './transform';
import { GenericFunction } from './primitives';
import { Apply, Flow, HKT } from './hkt';
import { Assume } from './lies';
import { Equal, Expect } from './tests';
import { Curry } from './curry';

// Just for testing purposes
type PossibleOptions = ['a', 'b', 'c', 'd'];
type Foo<U> = <const T extends U>(x: T) => T;


/**
 * Step 1: A simple overload function that takes a tuple of possible options and a function, and returns a function that can accept any of the possible options.
 * This as is is uvery usable. But we want to improve the DX.
 */

type ConvertTupleOfPossibleOptionsToOverloadsUnion<
    TupleOfPossibleOptions extends readonly any[],
    Render extends GenericFunction<any, any, any>
> = TupleOfPossibleOptions extends [infer OneOfPossibleOptions, ...infer RestOfPossibleOptions]
    ? | Render // weird flex but okay
    | ConvertTupleOfPossibleOptionsToOverloadsUnion<RestOfPossibleOptions, Render>
    : never;

export type overload<
    TAgainst extends readonly any[],
    TFunc extends GenericFunction<any, any, any>
> = UnionToIntersection<
    ConvertTupleOfPossibleOptionsToOverloadsUnion<
        TAgainst,
        TFunc
    >
>

// Tests
declare const method: overload<PossibleOptions, Foo<TupleToUnion<PossibleOptions>>>;
const methodResult = method('a');
type methodResult = Expect<Equal<typeof methodResult, "a">>;

/**
 * Step 2: Making it a bit better, by using HKTs. This is just an intermediate step towartds the final solution.
 * We can't skip to step 3 because we'll hit the wall of `TFunc is not generic` error. This is because of #1213.
 */
interface $TupleToUnion extends HKT {
    new: (x: Assume<this["_1"], any[]>) => TupleToUnion<Assume<this["_1"], any[]>>;
}

interface $Foo extends HKT {
    new: (x: Assume<this["_1"], any>) => Foo<Assume<this["_1"], any>>;
}

export type $overload<
    TOptions extends readonly any[],
    TFunc extends HKT & { new: GenericFunction<any, any, any> },
> =
    overload<
        TOptions,
        Apply<Flow<[$TupleToUnion, TFunc]>, TOptions>
    >;

// Tests
declare const method2: $overload<PossibleOptions, $Foo>;
const method2Result = method2('c'); // method3Result is of type "c"
type method2Result = Expect<Equal<typeof method2Result, "c">>;

/**
 * Step 3: Making it even better, we'll use a bit of fp to curry PossibleOptions and then pass just $Foo.
 */
declare function $overload2<
    TOptions extends readonly any[],
    TFunc extends HKT & { new: GenericFunction<any, any, any> },
>(options: TOptions, func: TFunc): $overload<TOptions, TFunc>;

declare const method3: Curry<typeof $overload2>;
type Method3Return = (func: HKT & { new: GenericFunction<any, any, any> }) => $overload<PossibleOptions, typeof func>;

