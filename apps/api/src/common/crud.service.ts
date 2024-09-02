import { Inject, Injectable } from '@nestjs/common';
import e, { $infer, select } from 'dbschema/edgeql-js';
import * as $ from 'dbschema/edgeql-js/reflection';
import type { Client } from 'edgedb';
import { EDGE_DB_CLIENT } from 'nest-edgedb';
import { SelectModifiers } from '../../dbschema/edgeql-js/select';
import { $scopify } from 'dbschema/edgeql-js/reflection';



export type ExtractShape<T> = T extends $.ObjectType<any, infer Shape, any, any> ? Shape : never;
export type MakeProjection<Shape> = {
  [K in keyof Shape]?: Shape[K] extends $.PropertyDesc<any, any, any, any, any, any> ? true : false;
}

@Injectable()
export abstract class CrudService<
  T extends $.ObjectType,
> {
  constructor(
    readonly model: $.$expr_PathNode,
    @Inject(EDGE_DB_CLIENT) protected readonly edgedbClient: Client,
  ) {}

  async findAll(modifiers?: Omit<SelectModifiers, 'filter_single'>): Promise<ExtractShape<T>[]> {
    const query = e.select(this.model, () => ({
      ...this.model['*'],
      ...modifiers
    }));

    return await query.run(this.edgedbClient) as ExtractShape<T>[];
  }


}
