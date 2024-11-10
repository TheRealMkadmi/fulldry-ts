export type TupleToUnion<T extends readonly unknown[]> = T[number];

export type ValuesTuple<T, K extends readonly (keyof T)[]> = {
    [I in keyof K]: K[I] extends keyof T ? T[K[I]] : never;
};

export type Reverse<T extends unknown[]> = T extends []
    ? []
    : T extends [infer U, ...infer Rest]
        ? [...Reverse<Rest>, U]
        : never;
