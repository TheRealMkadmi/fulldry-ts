// model.ts
import __defaultExports, { $User, $UserλShape, Pet, User } from 'dbschema/edgeql-js/modules/default';
import type * as _std from "dbschema/edgeql-js/modules/std";
import e from 'dbschema/edgeql-js';
import * as _ from "dbschema/edgeql-js/imports";
import { Client } from 'edgedb';


type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type StrictIdentity<T> = T & UnionToIntersection<T>
type RecursiveUnionToIntersection<U> =
    UnionToIntersection<U> extends infer I
    ? {
        [K in keyof I]: I[K] extends object
        ? RecursiveUnionToIntersection<I[K]>
        : I[K]
    }
    : never;

export type ModelNames = keyof __defaultExports;
export type Models = typeof __defaultExports[ModelNames];

// create a mapped type
export type ModelMap = {
    [K in ModelNames]: RecursiveUnionToIntersection<__defaultExports[K]>
}

export class BaseRepository<TModel extends Models, TModelName = ModelNames> {

    constructor(
        protected readonly modelName: TModelName,
        protected readonly model: StrictIdentity<TModel>,
        protected readonly edgedbClient: Client,
    ) { }


    async findAll() {
        const query = e
            .select(this.model, (m) => ({
                ...m['*'],
            }))
        const result = await query.run(this.edgedbClient);
        return result;
    }
}

export class test extends BaseRepository<typeof User> {
    constructor(edgedbClient: Client) {
        super(User, edgedbClient);
    }

    async findUser() {
        return await this.findAll();
    }
}