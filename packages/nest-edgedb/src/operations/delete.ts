import { Client } from "edgedb";
import { HKOperation, Coerce } from "packages/fulldry-utils/dist/fulldry-utils.cjs";
import { $expr_PathNode } from "../generated/syntax/reflection";
import { ModelIdentity } from "./types";
import e from '../generated/syntax';

export interface $RenderDeleteSingle extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>
    >(
        client: Client,
        model: T,
        id: string
    ) => Promise<ModelIdentity>;
}

export const deleteOne = async <T>(
    client: Client,
    model: T & $expr_PathNode,
    id: string
) => {
    return await e
        .delete(model, (m: any) => ({
            filter_single: e.op(m.id, '=', e.literal(e.str, id)),
        }))
        .run(client) as any;
};

// _____________________________

export interface $RenderDeleteMultiple extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends Coerce<this["_1"], $expr_PathNode>
    >(
        client: Client,
        model: T & $expr_PathNode,
        ids: string[]
    ) => Promise<ModelIdentity[]>;
}

export const deleteMany = async <T>(
    client: Client,
    model: T & $expr_PathNode,
    ids: string[]
) => {
    return await e
        .delete(model, (m: any) => ({
            filter: e.op(
                m.id,
                'in',
                e.array_unpack(e.literal(e.array(e.str), ids))
            ),
        }))
        .run(client) as any;
};
