import { Client } from "edgedb";
import { EntityManager, NarrowEntityManager } from "./entity-manager";
import { $expr_PathNode } from './generated/syntax/path';
import { objectTypeToSelectShape } from "./generated/syntax/select";
import { ModelTypeSet, ModelScope } from "./operations/types";

export class Repository<T extends $expr_PathNode> {
    private em: NarrowEntityManager<T>;
    constructor(
        private readonly model: T,
        private readonly client: Client
    ) {
        this.em = new EntityManager<[T]>();
    }

    findOneByIdWithProjection =
        async <Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>>(id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => {
            return await this.em.findOneByIdWithProjection(this.model, this.client, id, shape);
        }
}
