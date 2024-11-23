import { Client } from "edgedb";
import { HKOperation, Coerce } from "packages/fulldry-utils/dist/fulldry-utils.cjs";
import { $expr_PathNode, computeTsTypeCard } from "../generated/syntax/reflection";
import { SelectModifiers, ComputeSelectCardinality } from "../generated/syntax/select";
import { UpdateShape } from "../generated/syntax/update";
import { ModelTypeSet, ModelScope, ModelIdentity, FilterCallable, FilterType } from "./types";
import e from '../generated/syntax';

export interface $RenderUpdate extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends $expr_PathNode,
        Shape extends {
            filter?: SelectModifiers['filter'];
            filter_single?: SelectModifiers<ModelTypeSet<T>['__element__']>['filter_single'];
            set: UpdateShape<ModelTypeSet<T>>;
        }
    >(
        x: T,
        client: Client,
        shape: (scope: ModelScope<T>) => Readonly<Shape>
    ) => Promise<computeTsTypeCard<ModelIdentity, ComputeSelectCardinality<T, Shape>>>;
}

export const update = async <T, Shape>(
    model: T & $expr_PathNode,
    client: Client,
    shape: (scope: ModelScope<T>) => Readonly<Shape>
) => {
    return await e.update(model as any, shape as any).run(client);
};

// _____________________________

export interface $RenderUpdateMany extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <
        const T extends $expr_PathNode
    >(
        x: T,
        client: Client,
        filter: FilterCallable<T>,
        set: UpdateShape<ModelTypeSet<T>>
    ) => Promise<computeTsTypeCard<ModelIdentity, ComputeSelectCardinality<T, FilterType>>>;
}

export const updateMany = async <T>(
    model: T & $expr_PathNode,
    client: Client,
    filter: FilterCallable<T>,
    set: UpdateShape<ModelTypeSet<T>>
) => {
    return await e
        .update(model, (m: any) => ({
            filter: filter(m),
            set,
        }))
        .run(client);
};