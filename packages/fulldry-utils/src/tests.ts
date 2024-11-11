export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type Expect<T extends true> = T;

export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

type Includes<T extends readonly any[], U> = T extends [infer First, ...infer Rest]
  ? Equal<First, U> extends true
  ? true
  : Includes<Rest, U>
  : false;

type EnsureIncludes<T extends readonly any[], U> = Includes<T, U> extends true
  ? U
  : ['Error: T does not include U'];