export type Length<T extends any[]> =
    T extends { length: infer L } ? L : never;

export type BuildTuple<L extends number, T extends any[] = []> =
    T extends { length: L } ? T : BuildTuple<L, [...T, any]>;

export type EQ<A, B> =
    A extends B
    ? (B extends A ? true : false)
    : false;

export type IsPositive<N extends number> =
    `${N}` extends `-${number}` ? false : true;

export type IsWhole<N extends number> =
    `${N}` extends `${number}.${number}` ? false : true;

export type IsPositiveInteger<N extends number> =
    IsPositive<N> extends true
    ? (IsWhole<N> extends true ? true : false)
    : false;
