// work around for: https://github.com/microsoft/TypeScript/issues/27808
// "look at what they do to mimic a fraction of our power - C#"

import { TupleToUnion, UnionToIntersection } from './transform';
import { GenericFunction } from './primitives';


export type ConvertTupleOfPossibleOptionsToOverloadsUnion<
    TupleOfPossibleOptions extends readonly any[],
    Render extends GenericFunction<any, any, any>
> = TupleOfPossibleOptions extends [infer OneOfPossibleOptions, ...infer RestOfPossibleOptions]
    ? | Render
    | ConvertTupleOfPossibleOptionsToOverloadsUnion<RestOfPossibleOptions, Render>
    : never;

export type $overload<
    TFunc extends GenericFunction<any, any, any>,
    TAgainst extends readonly any[]
> = UnionToIntersection<
    ConvertTupleOfPossibleOptionsToOverloadsUnion<
        TAgainst,
        TFunc
    >
>

// Example usage:
declare type PossibleOptions = ['a', 'b', 'c'];
type RenderFindAll<OneOfPossibleOptions> = <const T extends OneOfPossibleOptions>(x: T) => T;
declare const method: $overload<RenderFindAll<TupleToUnion<PossibleOptions>>, PossibleOptions>;

const r = method('a'); // r is 'a'


