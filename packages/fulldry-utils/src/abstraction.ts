type F<A, B> = A & B;
type G<A, B> = A | B;

class A<M> {
    test1<T>(param1: M, param2: T): F<M, T> {
        return { ...param1, ...param2 };
    }
    test2<K>(param1: M, param2: K): G<M, K> {
        return param1 || param2;
    }
}

const a = new A<{ a: string }>();

const p1 = { a: 'a' };

const r = a.test1(p1, { b: 'b' });
const r2 = a.test2(p1, { b: 'b' });

console.log(r);

type MethodKeys<T, M> = {
    [K in keyof T]: T[K] extends (p1: M, ...args: any[]) => any ? K : never
}[keyof T];

type ElideFirstParam<T, M> = {
    [K in MethodKeys<T, M>]: T[K] extends (p1: M, ...args: infer A) => infer R ? (...args: A) => R : never;
};

function fixFirstParam<M, T extends A<M>>(instance: T, fixedParam: M): ElideFirstParam<T, M> {
    const methods = {} as ElideFirstParam<T, M>;
    (Object.keys(instance) as Array<MethodKeys<T, M>>).forEach((key) => {
        const method = instance[key];
        if (typeof method === 'function') {
            methods[key] = ((...args: any[]) => method.call(instance, fixedParam, ...args)) as any;
        }
    });
    return methods;
}

const fixedA = fixFirstParam(a, p1);

const r3 = fixedA.test1({ b: 'b' });
const r4 = fixedA.test2({ b: 'b' });

console.log(r3);
