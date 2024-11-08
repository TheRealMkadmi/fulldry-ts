export type Curry<T> = T extends (...args: infer Args) => infer R
    ? Args extends [infer First, ...infer Rest]
    ? (arg: First) => Curry<(...args: Rest) => R>
    : R
    : never;


type PossibleOptions = ['a', 'b', 'c', 'd'];
type Foo<U extends PossibleOptions, K> = <const T extends U>(x: T) => T & K;



