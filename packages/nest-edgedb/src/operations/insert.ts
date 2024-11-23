import { Client } from "edgedb";
import { HKOperation, Coerce } from "packages/fulldry-utils/dist/fulldry-utils.cjs";
import { InsertShape } from "../generated/syntax/insert";
import { $expr_PathNode } from "../generated/syntax/reflection";
import { ModelTypeSet, ModelIdentity } from "./types";
import e from '../generated/syntax';

export interface $RenderInsertSingle extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends $expr_PathNode
    >(
        x: T,
        client: Client,
        data: InsertShape<ModelTypeSet<T>['__element__']>
    ) => Promise<Exclude<ModelIdentity, null>>;
}

export const insert = async <T>(
    client: Client,
    model: T & $expr_PathNode,
    data: InsertShape<ModelTypeSet<T>['__element__']>
) => {
    return await e.insert(model as any, data as never).run(client);
};

// _____________________________

export interface $RenderInsertMultiple extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends $expr_PathNode
    >(
        x: T,
        client: Client,
        data: InsertShape<ModelTypeSet<T>['__element__']>[]
    ) => Promise<Exclude<ModelIdentity, null>[]>;
}

export const insertMany = async <T>(
    client: Client,
    model: T & $expr_PathNode,
    data: InsertShape<ModelTypeSet<T>['__element__']>[]
) => {
    const query = e.set(...data.map((d) => e.insert(model, d)));
    return await query.run(client);
};