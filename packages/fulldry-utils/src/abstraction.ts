type OmitFirstParam<T> = T extends (arg1: any, ...args: infer P) => infer R ? (...args: P) => R : never;

type RemoveFirstParameterFromClassMethods<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any
    ? OmitFirstParam<T[K]>
    : T[K];
};

