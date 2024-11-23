export type UnionToIntersection<U> =
    (U extends any ? (_: U) => void : never) extends ((_: infer I) => void) ? I : never;

export type MethodNames<ClassType> = {
    [K in keyof ClassType]: ClassType[K] extends (...args: any[]) => any ? K : never;
}[keyof ClassType];