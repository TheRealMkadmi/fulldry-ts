// https://github.com/microsoft/TypeScript/issues/27808
// "look at what they do to mimic a fraction of out power - C# -- Chobba"

export type UnionToIntersection<U> =
    (U extends any ? (_: U) => void : never) extends ((_: infer I) => void) ? I : never;

export type RenderFunction<
    Generics extends any[] = [],
    Args extends any[] = [],
    Return = any
> = <G extends Generics, A extends Args>(...args: A) => Return;

export type ConvertTupleOfPossibleOptionsToOverloadsUnion<
    TupleOfPossibleOptions extends readonly any[],
    Render extends RenderFunction<any, any, any>
> = TupleOfPossibleOptions extends [infer OneOfPossibleOptions, ...infer RestOfPossibleOptions]
    ? | Render
    | ConvertTupleOfPossibleOptionsToOverloadsUnion<RestOfPossibleOptions, Render>
    : never;

export type ConvertTupleOfPossibleOptionsToOverloadsIntersection<
    TupleOfPossibleOptions extends readonly any[],
    Render extends RenderFunction<any, any, any>
> = UnionToIntersection<
    ConvertTupleOfPossibleOptionsToOverloadsUnion<
        TupleOfPossibleOptions,
        Render
    >
>;