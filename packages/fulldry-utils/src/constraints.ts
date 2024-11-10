export type IsPositive<N extends number> =
    `${N}` extends `-${number}` ? false : true;

export type IsInteger<N extends number> =
    `${N}` extends `${number}.${number}` ? false : true;

export type IsPositiveInteger<N extends number> =
    IsPositive<N> extends true
    ? (IsInteger<N> extends true ? true : false)
    : false;

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type NotAny<T> = true extends IsAny<T> ? false : true;
