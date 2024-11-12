import R = require("types-ramda");

// types.ts
export type F<A, B> = A & B;
export type G<A, B> = A | B;

// utils.ts
export type MethodNamesWithFirstParam<T, P> = {
    [K in keyof T]: T[K] extends (param1: P, ...args: any[]) => any ? K : never;
}[keyof T];

export type PartiallyAppliedMethods<T, P> = {
    [K in MethodNamesWithFirstParam<T, P>]: T[K] extends (param1: P, ...args: infer Args) => infer R
    ? (...args: Args) => R
    : never;
};

// A.ts
export class A<M> {
    test1<T>(param1: M, param2: T): F<M, T> {
        return { ...param1, ...param2 };
    }
    test2<K>(param1: M, param2: K): G<M, K> {
        return param1 || param2;
    }
    test3<L>(param1: M, param2: L): string {
        return `${JSON.stringify(param1)} and ${JSON.stringify(param2)}`;
    }
}


export function createTypedPartialHelper<T, P>(
    instance: T,
    fixedParam: P,
    methods: MethodNamesWithFirstParam<T, P>[]
): PartiallyAppliedMethods<T, P> {
    const helper: Partial<PartiallyAppliedMethods<T, P>> = {};

    methods.forEach((methodName) => {
        const method = instance[methodName];
        if (typeof method === 'function') {
            // Partially apply using Ramda
            const partiallyApplied = R.partial(method.bind(instance), [fixedParam]);
            helper[methodName as keyof PartiallyAppliedMethods<T, P>] = partiallyApplied as T[typeof methodName] extends (param1: P, ...args: infer Args) => infer R ? (...args: Args) => R : never;
        }
    });

    return helper as PartiallyAppliedMethods<T, P>;
}

// Instantiate class A with type parameter { a: string }
const aInstance = new A<{ a: string }>();

// Fixed parameter for partial application
const fixedParam = { a: 'fixedA' };

// Specify methods to partially apply
const methodsToPartial = ['test1', 'test2', 'test3'] as (keyof A<{ a: string }>)[];

// Create the typed partial helper
const typedHelper = createTypedPartialHelper(aInstance, fixedParam, methodsToPartial);

// Use the helper
const result1 = typedHelper.test1({ b: 'b' }); // F<{ a: string }, { b: string }>
const result2 = typedHelper.test2({ b: 'b' }); // G<{ a: string }, { b: string }>
const result3 = typedHelper.test3({ b: 'b' }); // string

console.log('Typed Helper Results:', result1, result2, result3);
