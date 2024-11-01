export type GenericFunction<
    Generics extends any[] = [],
    Args extends any[] = [],
    Return = any
> = <G extends Generics, A extends Args>(...args: A) => Return;
