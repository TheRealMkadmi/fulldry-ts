import { Client } from "edgedb";
import { HKOperation, Coerce } from "packages/fulldry-utils/dist/fulldry-utils.cjs";
import { Expression, TypeSet, $scopify, BaseType } from "../generated/syntax/typesystem";
import { objectTypeToSelectShape } from "../generated/syntax/select";
import { ModelTypeSet } from "./types";
import e from '../generated/syntax';
import { Cardinality } from "edgedb/dist/reflection/enums";
import { $expr_PathNode } from "../generated/syntax/reflection";


type SingletonSet = Expression<
    TypeSet<BaseType, Cardinality.One | Cardinality.AtMostOne>
>;
type SimpleGroupElements = { [k: string]: SingletonSet };

export interface $RenderGroup extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends Coerce<this["_1"], BaseType> & $expr_PathNode,
        Shape extends { by?: SimpleGroupElements } & objectTypeToSelectShape<T["__element__"]>,
    >(
        client: Client,
        model: T,
        getter: (
            arg: $scopify<ModelTypeSet<T>['__element__']>
        ) => Readonly<Shape>
    ) => ReturnType<typeof e.group<T, Shape>>;
}

export const group = async <
    T extends $expr_PathNode,
    Shape extends { by?: SimpleGroupElements } & objectTypeToSelectShape<T["__element__"]>
>(
    client: Client,
    model: T,
    getter: (
        arg: $scopify<T['__element__']>
    ) => Readonly<Shape>
) => {
    const query = e.group(model, getter);
    const result = await query.run(client);
    return result;
};