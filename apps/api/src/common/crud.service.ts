import { Inject, Injectable } from '@nestjs/common';
import e, { $infer } from 'dbschema/edgeql-js';
import { UpdateShape } from 'dbschema/edgeql-js/update';
import * as $ from '../../dbschema/edgeql-js/reflection';
import { InsertShape } from '../../dbschema/edgeql-js/insert';
import type { ObjectTypeExpression } from '../../dbschema/edgeql-js/reflection';
import type { Client } from 'edgedb';
import { EDGE_DB_CLIENT } from 'nest-edgedb';

type ExprPathNode<T extends $.ObjectType> = $.$expr_PathNode<any>;
type ExtendedObjectType = $.ObjectType<string, $.ObjectTypePointers & { id: $.PropertyDesc }, any, $.ExclusiveTuple>;


@Injectable()
export abstract class CrudService<
  T extends ExtendedObjectType
> {
  constructor(
    private readonly model: ExprPathNode<T>,
    @Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client,
  ) {}

  async findAll(): Promise<$infer<T>[]> {
    const query = e.select(this.model);
    return await query.run(this.edgedbClient) as Promise<$infer<T>[]>;
  }

  async findOne(id: string): Promise<$infer<T> | null> {
    const query = e.select(this.model, (type: any) => ({
      ...type['*'],
      filter_single: e.op(type.id, '=', id)
    }));
    return await query.run(this.edgedbClient) as Promise<$infer<T> | null>;
  }

  async findMany(ids: string[]): Promise<$infer<T>[]> {
    const query = e.select(this.model, (type: any) => ({
      ...type['*'],
      filter: e.op(type['id'], 'in', e.set(...ids as any[]))
    }));
    return await query.run(this.edgedbClient) as Promise<$infer<T>[]>;
  }

  async count(): Promise<number> {
    const query = e.select(e.count(this.model));
    return query.run(this.edgedbClient) as Promise<number>;
  }

  async paginate(limit: number, offset: number): Promise<$infer<T>[]> {
    const query = e.select(this.model, (type: any) => ({
      ...type['*'],
      order_by: {
        expression: type['id'],
        direction: e.DESC,  // Specify DESC direction here
      },
      limit: limit,
      offset: offset
    }));
    return await query.run(this.edgedbClient) as Promise<$infer<T>[]>;
  }

  async create(shape: InsertShape<T>): Promise<$infer<T>> {
    return e.insert(this.model, shape as never).run(this.edgedbClient) as Promise<$infer<T>>;
  }

  async update<Q extends ObjectTypeExpression>(id: string, data: UpdateShape<Q>): Promise<$infer<T>> {
    const query = e.update(this.model, (type: any) => ({
      set: data,
      filter: e.op(type['id'], '=', id)
    }));
    return query.run(this.edgedbClient) as Promise<$infer<T>>;
  }

  async delete(id: string): Promise<void> {
    const query = e.delete(this.model, (type: any) => ({
      filter: e.op(type['id'], '=', id)
    }));
    await query.run(this.edgedbClient);
  }
}
