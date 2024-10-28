export type ValuesTuple<T, K extends readonly (keyof T)[]> = {
    [I in keyof K]: K[I] extends keyof T ? T[K[I]] : never;
};