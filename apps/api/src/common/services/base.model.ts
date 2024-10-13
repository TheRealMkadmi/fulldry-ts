// model.ts
import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import __defaultExports, { $User, $UserλShape } from 'dbschema/edgeql-js/modules/default';
import type * as _std from "dbschema/edgeql-js/modules/std";

import * as $ from "dbschema/edgeql-js/reflection";
import * as _ from "dbschema/edgeql-js/imports";
import { $ObjectType } from 'dbschema/edgeql-js/modules/schema';

export type BaseShape = {
    id: $.PropertyDesc<_std.$uuid, $.Cardinality.One, true, false, true, true>;
    __type__: $.LinkDesc<$ObjectType, $.Cardinality.One, {}, false, false, true, false>;
}

type m = $.computeTsType<$User, $.Cardinality.One>;

export abstract class BaseRepository
    <
        T extends $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null>,
        S extends $.BaseType = T['__element__'],
        C extends $.Cardinality = T['__cardinality__']

    > {

    constructor(
        protected readonly model: $.$expr_PathNode,
        protected readonly edgedbClient: Client
    ) {
    }

    async findAll() {
        return await e
            .select(this.model, (m) => ({
                ...m['*'],
            }))
            .run(this.edgedbClient) as $.computeTsType<S, C>;
    }

}

