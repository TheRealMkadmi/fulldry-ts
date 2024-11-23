import { Client } from "edgedb";
import { HKOperation, Coerce } from "packages/fulldry-utils/dist/fulldry-utils.cjs";
import { $expr_PathNode } from '../generated/syntax/path';
import { NumericFields, FilterCallable } from "./types";
import e from '../generated/syntax';

export interface $RenderSum extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends $expr_PathNode,
        Field extends NumericFields<T>
    >(
        x: T,
        client: Client,
        field: Field,
        filter?: FilterCallable<T>
    ) => Promise<number | null>;
}

export const sum = async <T, Field extends NumericFields<T>>(
    model: T,
    client: Client,
    field: Field,
    filter?: FilterCallable<T>
) => {
    return await aggregate(client, model, field, e.sum, filter);
};

// _____________________________

export interface $RenderMin extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends $expr_PathNode,
        Field extends NumericFields<T>
    >(
        x: T,
        client: Client,
        field: Field,
        filter?: FilterCallable<T>
    ) => Promise<number | null>;
}

export const min = async <T, Field extends NumericFields<T>>(
    model: T,
    client: Client,
    field: Field,
    filter?: FilterCallable<T>
) => {
    return await aggregate(client, model, field, e.min, filter);
};

// _____________________________

export interface $RenderMax extends HKOperation {
    new: (x: Coerce<this["_1"], unknown>) => <
        const T extends $expr_PathNode,
        Field extends NumericFields<T>
    >(
        x: T,
        client: Client,
        field: Field,
        filter?: FilterCallable<T>
    ) => Promise<number | null>;
}

export const max = async <T, Field extends NumericFields<T>>(
    model: T,
    client: Client,
    field: Field,
    filter?: FilterCallable<T>
) => {
    return await aggregate(client, model, field, e.max, filter);
};

// _____________________________

// Aggregate Helper Function
const aggregate = async <
    T,
    Field extends NumericFields<T>
>(
    client: Client,
    model: T,
    field: Field,
    aggregation: (field: any) => any,
    filter?: FilterCallable<T>
): Promise<number | null> => {
    const query = e.select(model, (m: any) => ({
        filter: filter ? filter(m) : undefined,
        value: aggregation(m[field]),
    }));
    const retVal = await query.run(client);
    return retVal.length === 0 ? null : (retVal[0].value as number | null);
};
