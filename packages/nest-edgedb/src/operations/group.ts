import { Client } from "edgedb";
import { Cardinality } from "edgedb/dist/ifaces";
import { BaseType } from "edgedb/dist/reflection/queries";
import { HKOperation, Coerce } from "packages/fulldry-utils/dist/fulldry-utils.cjs";
import { Expression, TypeSet, $scopify } from "../generated/syntax/reflection";
import { objectTypeToSelectShape } from "../generated/syntax/select";
import { ModelTypeSet } from "./types";
import e from '../generated/syntax';

export interface $RenderGroupBy extends HKOperation {
    new: (x: Coerce<this["_1"], BaseType>) => <
        const T extends Coerce<this["_1"], BaseType>,
        Shape extends {
            by?: {
                [k: string]: Expression<
                    TypeSet<T, Cardinality.One | Cardinality.AtMostOne>
                >;
            };
        } & objectTypeToSelectShape<ModelTypeSet<T>['__element__']>
    >(
        client: Client,
        model: T,
        getter: (
            arg: $scopify<ModelTypeSet<T>['__element__']>
        ) => Readonly<Shape>
    ) => Promise<any>;
}

export const groupBy = async <T, Shape>(
    client: Client,
    model: ModelTypeSet<T>,
    getter: (
        arg: $scopify<ModelTypeSet<T>['__element__']>
    ) => Readonly<Shape>
) => {
    const query = e.group(model, getter);
    const result = await query.run(client);
    return result;
};