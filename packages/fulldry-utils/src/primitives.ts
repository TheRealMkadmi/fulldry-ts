export type GenericFunction<
    Generics extends any[] = [],
    Args extends any[] = [],
    Return = any
> = <G extends Generics, A extends Args>(...args: A) => Return;

export type InferredType = string | number | boolean | object | undefined | null;

export type InferredTuple = InferredType[] | ReadonlyArray<InferredType>;