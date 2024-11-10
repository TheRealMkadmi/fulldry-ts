export type Coerce<T, U> = T extends U ? T : U;

export type InstanceOf<T> = T extends new (...args: any) => infer R ? R : never;
