// Import Ramda with proper type definitions
import * as R from 'ramda';

// Define types for combining and union operations
type F<A, B> = A & B;
type G<A, B> = A | B;

// Utility types to extract method names with first parameter of type P
type MethodNamesWithFirstParam<T, P> = {
    [K in keyof T]: T[K] extends (param1: P, ...args: any[]) => any ? K : never;
}[keyof T];

// Utility type to define partially applied methods
type PartiallyAppliedMethods<T, P> = {
    [K in MethodNamesWithFirstParam<T, P>]: T[K] extends (param1: P, ...args: infer Args) => infer R
    ? (...args: Args) => R
    : never;
};

// Class A with generic type parameter M
class A<M extends object> {
    test1<T>(param1: M, param2: T): F<M, T> {
        return { ...param1, ...param2 };
    }
    test2<K>(param1: M, param2: K): G<M, K> {
        return param1 || param2;
    }
    test3<L>(param1: M, param2: L): string {
        return `${JSON.stringify(param1)} and ${JSON.stringify(param2)}`;
    }
    test4<N extends object>(param1: M, param2: N): number {
        return Object.keys(param1).length + Object.keys(param2).length;
    }
}

// Type-safe partial application wrapper for Ramda's partial
function partialFirst<P, A extends any[], R>(
    fn: (param1: P, ...args: A) => R,
    partialArgs: [P]
): (...args: A) => R {
    return R.partial(fn, partialArgs) as (...args: A) => R;
}

// Helper function to create partially applied methods
function createTypedPartialHelper<T, P>(
    instance: T,
    fixedParam: P,
    methods: readonly MethodNamesWithFirstParam<T, P>[]
): PartiallyAppliedMethods<T, P> {
    const helper: Partial<PartiallyAppliedMethods<T, P>> = {};

    methods.forEach((methodName) => {
        const method = instance[methodName];
        if (typeof method === 'function') {
            // Partially apply the first parameter using the type-safe partialFirst
            const partiallyApplied = partialFirst(method.bind(instance), [fixedParam]);
            // Assign the partially applied method to the helper with correct typing
            helper[methodName as keyof PartiallyAppliedMethods<T, P>] = partiallyApplied as PartiallyAppliedMethods<T, P>[typeof methodName];
        }
    });

    return helper as PartiallyAppliedMethods<T, P>;
}

// Instantiate class A with type parameter { a: string }
const aInstance = new A<{ a: string }>();

// Fixed parameter to be partially applied
const fixedParam = { a: 'fixedA' };

// Specify methods to partially apply
const methodsToPartial = ['test1', 'test2', 'test3', 'test4'] as const;

// Create the typed partial helper
const typedHelper = createTypedPartialHelper(aInstance, fixedParam, methodsToPartial);

// Use the helper and log the results
const result1 = typedHelper.test1({ b: 'b' });
console.log('Result1:', result1); // { a: 'fixedA', b: 'b' }

const result2 = typedHelper.test2({ b: 'b' });
console.log('Result2:', result2); // { a: 'fixedA', b: 'b' }

const result3 = typedHelper.test3({ b: 'b' });
console.log('Result3:', result3); // '{"a":"fixedA"} and {"b":"b"}'

const result4 = typedHelper.test4({ b: 'b' });
console.log('Result4:', result4); // 2

// Type Assertions (for verification in TypeScript)
type Test1Type = typeof result1; // { a: string; b: string }
type Test2Type = typeof result2; // { a: string } | { b: string }
type Test3Type = typeof result3; // string
type Test4Type = typeof result4; // number
