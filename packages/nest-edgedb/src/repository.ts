import { Client } from "edgedb";
import { EntityManager, NarrowEntityManager } from "./entity-manager";
import { $expr_PathNode } from './generated/syntax/path';
import { objectTypeToSelectShape } from "./generated/syntax/select";
import { ModelTypeSet, ModelScope, FilterCallable, NumericFields } from "./operations/types";
import { InsertShape } from "./generated/syntax/insert";
import { UpdateShape } from "./generated/syntax/update";
import { $scopify } from "./generated/syntax/typesystem";
import { SimpleGroupElements } from "./operations/group";

export class Repository<T extends $expr_PathNode> {
    private readonly model: T;
    private readonly em: NarrowEntityManager<T>;
    private readonly client: Client;

    constructor(
        model: T,
        em: NarrowEntityManager<T>,
        client: Client
    ) {
        this.model = model;
        this.em = em;
        this.client = client;
    }

    findOneByIdWithProjection =
        async <Shape extends objectTypeToSelectShape<ModelTypeSet<T>["__element__"]>>
            (id: string, shape: (scope: ModelScope<T>) => Readonly<Shape>) => {
            return await this.em.findOneByIdWithProjection(this.model, this.client, id, shape);
        }

    findAll = async () => {
        return await this.em.findAll(this.model, this.client);
    };

    findOneById = async (id: string) => {
        return await this.em.findOneById(this.model, this.client, id);
    };

    insert = async (data: InsertShape<ModelTypeSet<T>['__element__']>) => {
        return await this.em.insert(this.model, this.client, data);
    };

    insertMany = async (data: InsertShape<ModelTypeSet<T>['__element__']>[]) => {
        return await this.em.insertMany(this.model, this.client, data);
    };

    update = async (data: UpdateShape<T>) => {
        return await this.em.update(this.model, this.client, data);
    };

    updateMany = async (filter: FilterCallable<T>, data: UpdateShape<T>) => {
        return await this.em.updateMany(this.model, this.client, filter, data);
    };

    deleteOne = async (id: string) => {
        return await this.em.deleteOne(this.model, this.client, id);
    };

    deleteMany = async (ids: string[]) => {
        return await this.em.deleteMany(this.model, this.client, ids);
    };

    sum = async (field: NumericFields<T>, filter?: FilterCallable<T>) => {
        return await this.em.sum(this.model, this.client, field, filter);
    };

    min = async (field: NumericFields<T>, filter?: FilterCallable<T>) => {
        return await this.em.min(this.model, this.client, field, filter);
    };

    max = async (field: NumericFields<T>, filter?: FilterCallable<T>) => {
        return await this.em.max(this.model, this.client, field, filter);
    };

    findAllIds = async (limit?: number, offset?: number) => {
        return await this.em.findAllIds(this.model, this.client, limit, offset);
    };

    findManyByIds = async (ids: string[]) => {
        return await this.em.findManyByIds(this.model, this.client, ids);
    };

    group = async <Shape extends { by?: SimpleGroupElements } & objectTypeToSelectShape<T["__element__"]>>(
        getter: (arg: $scopify<T['__element__']>) => Readonly<Shape>
    ) => {
        return await this.em.group(this.model, this.client, getter);
    };

    count = async (filter?: FilterCallable<T>) => {
        return await this.em.count(this.model, this.client, filter);
    };

    exists = async (filter?: FilterCallable<T>) => {
        return await this.em.exists(this.model, this.client, filter);
    };
}

export function createRepository(model: $expr_PathNode, em: NarrowEntityManager<$expr_PathNode>, client: Client) {
    return new Repository(model, em, client);
}