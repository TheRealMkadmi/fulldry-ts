// model.ts
import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import __defaultExports from 'dbschema/edgeql-js/modules/default';


type EntityMap = typeof __defaultExports;
type EntityNames = keyof EntityMap;



type IsAny<T> = (
    0 extends (1 & T) ?
    true :
    false
);

type IsNever<T> = (
    [T] extends [never] ?
    (
        IsAny<T> extends true ?
        false :
        true
    ) :
    false
);

type IsStringLiteral<T extends string> = (
    IsAny<T> extends true ?
    false :
    IsNever<T> extends true ?
    false :
    string extends T ?
    false :
    true
);

type IsOneStringLiteral<T extends string> = (
    IsStringLiteral<T> extends true ?
    (
        {
            [k in T]: (
                Exclude<T, k> extends never ?
                true :
                false
            )
        }[T]
    ) :
    false
);

declare function GetConfiguration<K extends Extract<keyof __defaultExports, string>>(
    key: (
        IsOneStringLiteral<K> extends true ?
        K :
        [K, "is not a single string literal"]
    )
): __defaultExports[K];

const test = GetConfiguration<'User'>('User');



class GenericModel<K extends Extract<keyof __defaultExports, string>> {
    model: __defaultExports[K];

    constructor(key: K) {
        this.model = GetConfiguration(key as IsOneStringLiteral<K> extends true ? K : never);
    }

    async findAll(client: Client) {
        return await e
            .select(this.model, (m) => ({
                ...m['*'],
            }))
            .run(client);
    }
}

const model = new GenericModel('User');