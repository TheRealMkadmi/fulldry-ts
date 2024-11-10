// workaround for: https://github.com/microsoft/TypeScript/issues/27808
// https://github.com/microsoft/TypeScript/issues/14107
// look at what they do to mimic a fraction of our power - C#

/**
 * TypeScript currently has neither generic values, higher kinded types, nor typeof on arbitrary expressions. 
 * Generics in TypeScript are sort of "shallow" that way. 
 */

import { UnionToIntersection } from './transform';
import { GenericFunction } from './primitives';
import { Apply, Flow, HKT } from './hkt';
import { Assume } from './lies';
import { Equal, Expect } from './tests';
import { TupleToUnion } from './tuples';


// Just for testing purposes
type PossibleOptions = ['a', 'b', 'c', 'd'];
type Foo<U> = <const T extends U>(x: T) => T;
type Bar<U extends string> = <const T extends U>(x: T) => `This is ${T}`;


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
 * Step 3: Making it even better, we'll wrap PossibleOptions and then pass just $Foo.
 * Dirty until we get at least https://github.com/tc39/proposal-partial-application in, https://github.com/microsoft/TypeScript/issues/11233
 * https://github.com/microsoft/TypeScript/issues/37181 -> https://github.com/microsoft/TypeScript/pull/47607
 * https://github.com/microsoft/TypeScript/issues/40179
 * > https://github.com/microsoft/TypeScript/issues/26043
 * > https://github.com/microsoft/TypeScript/pull/17961 <!-- fml
 */
type WrapHkt<T extends readonly any[]> = <TFunc extends HKT & { new: GenericFunction<any, any, any> }>() => $overload<T, TFunc>;
type Wrap<T extends readonly any[]> = <TFunc extends GenericFunction<any, any, any>>() => overload<T, TFunc>;

// Tests
declare const wrap: WrapHkt<PossibleOptions>;
type ApplyHktOverload<TFunc extends HKT> = ReturnType<typeof wrap<TFunc>>;
declare const method3: ApplyHktOverload<$Foo>;
const method3Result = method3('d'); // method3Result is of type "d"
type method3Result = Expect<Equal<typeof method3Result, "d">>;

declare const wrap2: Wrap<PossibleOptions>;
type ApplyOverload<TFunc extends GenericFunction<any, any, any>> = ReturnType<typeof wrap2<TFunc>>;
declare const method4: ApplyOverload<Foo<TupleToUnion<PossibleOptions>>>;
const method4Result = method4('b'); // method4Result is of type "b"
type method4Result = Expect<Equal<typeof method4Result, "b">>;

