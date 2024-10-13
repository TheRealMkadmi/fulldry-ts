// model.ts
import __defaultExports, { $User, $UserλShape, Pet, User } from 'dbschema/edgeql-js/modules/default';
import type * as _std from "dbschema/edgeql-js/modules/std";
import e from 'dbschema/edgeql-js';

import * as _ from "dbschema/edgeql-js/imports";
import { Client } from 'edgedb';


type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type Models = typeof Pet | typeof User;


export class BaseRepository<TModel extends Models> {

    constructor(
        protected readonly model: TModel & UnionToIntersection<TModel>,
        protected readonly edgedbClient: Client,
    ) { }


    async findAll() {
        return await e
            .select(this.model, (m) => ({
                ...m['*'],
            }))
            .run(this.edgedbClient);
    }
}

export class test extends BaseRepository<typeof User | typeof User> {
    constructor(edgedbClient: Client) {
        super(User, edgedbClient);
    }

    async findUser() {
        return await this.findAll();
    }
}