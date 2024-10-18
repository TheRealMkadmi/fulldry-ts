import { Client } from 'edgedb';
import e, { $infer } from 'dbschema/edgeql-js';
import {
  setToTsType,
  type $scopify,
} from 'dbschema/edgeql-js/typesystem';
import {
  objectTypeToSelectShape,
  SelectModifiers,
} from 'dbschema/edgeql-js/select';
import { insert, InsertShape } from '../../../dbschema/edgeql-js/insert';
import { $expr_PathNode, $linkPropify } from '../../../dbschema/edgeql-js/path';
import { Cardinality } from 'dbschema/edgeql-js/reflection';
import { $Pet, $PetλShape, Pet, User } from '../../../dbschema/edgeql-js/modules/default';
import { UpdateShape } from '../../../dbschema/edgeql-js/update';
import type * as _std from '../../../dbschema/edgeql-js/modules/std';

type Model = typeof Pet;

type ExtractTypeSet<T> = T extends $expr_PathNode<infer U, any> ? U : never;
type ModelTypeSet = ExtractTypeSet<Model>;
type ModelShape = ModelTypeSet['__element__']['__pointers__']

type BackLinks = {
  [K in keyof ModelShape as K extends `<${string}[${string}]` ? K : never]: ModelShape[K];
};

type NumericFields = {
  [K in keyof ModelShape]: ModelShape[K]['target'] extends _std.$number ? K : never;
}[keyof ModelShape];

export class CrudService {
  constructor(
    protected readonly edgedbClient: Client,
    protected readonly model: Model,
  ) { }

  async findAll() {
    const query = e
      .select(this.model, (m) => ({
        ...m['*'],
      }));
    return await query.run(this.edgedbClient);
  }

  async findOneById(id: string) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async findAllIds() {
    return await e.select(this.model);
  }

  async findOneByIdProjection<
    Expr extends ModelTypeSet,
    Element extends Expr["__element__"],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
    Scope extends $scopify<Element> &
    $linkPropify<{
      [k in keyof Expr]: k extends "__cardinality__"
      ? Cardinality.One
      : Expr[k];
    }>,
  >(
    id: string,
    shape: (scope: Scope) => Readonly<Shape>,
  ) {
    return await e
      .select(this.model, (model) => ({
        ...shape,
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }


  async select<
    Expr extends ModelTypeSet,
    Modifiers extends SelectModifiers,
  >(
    modifiers: (expr: Expr) => Readonly<Modifiers>,
  ) {
    return await e.select(this.model, (model) => ({
      ...modifiers,
    })).run(this.edgedbClient);
  }

  async find<
    Expr extends ModelTypeSet,
    Element extends Expr["__element__"],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
    Scope extends $scopify<Element> &
    $linkPropify<{
      [k in keyof Expr]: k extends "__cardinality__"
      ? Cardinality.One
      : Expr[k];
    }>,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
  ) {
    return await e.select(this.model, (model) => ({
      ...shape,
    })).run(this.edgedbClient);
  }

  async findManyByIds(ids: string[]) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
      }))
      .run(this.edgedbClient);
  }

  async findManyByIdsWithProjection<
    Expr extends ModelTypeSet,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
  >(ids: string[], shape: Readonly<Omit<Shape, 'filter_single'>>) {
    const query = e.select(this.model, (model) => ({
      ...shape,
      filter: e.op(
        model.id,
        'in',
        e.array_unpack(e.literal(e.array(e.str), ids)),
      ),
    }));
    return await query.run(this.edgedbClient);
  }

  async findByBackLink(backlink: keyof BackLinks, id: string) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model[backlink]['id'],
          '=',
          e.uuid(id),
        ),
      }))
      .run(this.edgedbClient);
  }

  async findAllPaginate(take: number, skip: number) {
    return await e
      .select(this.model, (m) => ({
        ...m['*'],
        limit: take,
        offset: skip,
      }))
      .run(this.edgedbClient);
  }

  async findAllIdsPaginate(take: number, skip: number) {
    return await e
      .select(this.model, (model) => ({
        ...model,
        limit: take,
        offset: skip,
      }))
      .run(this.edgedbClient);
  }

  async selectPaginate<
    Expr extends ModelTypeSet,
    Modifiers extends SelectModifiers,
  >(
    modifiers: (expr: Expr) => Readonly<Modifiers>,
    take: number,
    skip: number,
  ) {
    return await e.select(this.model, (model) => ({
      ...modifiers,
      limit: take,
      offset: skip,
    })).run(this.edgedbClient);
  }

  async findPaginate<
    Expr extends ModelTypeSet,
    Element extends Expr["__element__"],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
    Scope extends $scopify<Element> &
    $linkPropify<{
      [k in keyof Expr]: k extends "__cardinality__"
      ? Cardinality.One
      : Expr[k];
    }>,
  >(
    shape: (scope: Scope) => Readonly<Shape>,
    take: number,
    skip: number,
  ) {
    return await e.select(this.model, (model) => ({
      ...shape,
      limit: take,
      offset: skip,
    })).run(this.edgedbClient);
  }

  async findManyByIdsPaginate(ids: string[], take: number, skip: number) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
        limit: take,
        offset: skip,
      }))
      .run(this.edgedbClient);
  }

  async findOneByIdProjectionPaginate<
    Expr extends ModelTypeSet,
    Element extends Expr["__element__"],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
    Scope extends $scopify<Element> &
    $linkPropify<{
      [k in keyof Expr]: k extends "__cardinality__"
      ? Cardinality.One
      : Expr[k];
    }>,
  >(
    id: string,
    shape: (scope: Scope) => Readonly<Shape>,
    take: number,
    skip: number,
  ) {
    return await e
      .select(this.model, (model) => ({
        ...shape,
        filter_single: e.op(model.id, '=', e.uuid(id)),
        limit: take,
        offset: skip,
      }))
      .run(this.edgedbClient);
  }

  async findManyByIdsWithProjectionPaginate<
    Expr extends ModelTypeSet,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
  >(ids: string[], shape: Readonly<Omit<Shape, 'filter_single'>>, take: number, skip: number) {
    const query = e.select(this.model, (model) => ({
      ...shape,
      filter: e.op(
        model.id,
        'in',
        e.array_unpack(e.literal(e.array(e.str), ids)),
      ),
      limit: take,
      offset: skip,
    }));
    return await query.run(this.edgedbClient);
  }

  async findByBackLinkPaginate(backlink: keyof BackLinks, id: string, take: number, skip: number) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter: e.op(
          model[backlink]['id'],
          '=',
          e.uuid(id),
        ),
        limit: take,
        offset: skip,
      }))
      .run(this.edgedbClient);
  }

  async count(
    filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter'],
  ): Promise<number> {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    return await e.count(query).run(this.edgedbClient);
  }

  async exists(
    filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter'],
  ): Promise<boolean> {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    return await e.count(query).run(this.edgedbClient) > 0;
  }

  async increment(
    id: string,
    field: NumericFields,
    value: number = 1,
  ) {
    return await e
      .update(this.model, (model) => ({
        filter_single: e.op(model.id, '=', e.uuid(id)),
        set: {
          [field]: e.op(model[field], '+', value),
        },
      }))
      .run(this.edgedbClient);
  }

  async decrement(
    id: string,
    field: NumericFields,
    value: number = 1,
  ) {
    return await e
      .update(this.model, (model) => ({
        filter_single: e.op(model.id, '=', e.uuid(id)),
        set: {
          [field]: e.op(model[field], '-', value),
        },
      }))
      .run(this.edgedbClient);
  }

  async sum(field: NumericFields, filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter']) {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value: e.sum(model[field]),
    }));
    return await query.run(this.edgedbClient);
  }

  async min(field: NumericFields, filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter']) {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value: e.min(model[field]),
    }));
    return await query.run(this.edgedbClient);
  }

  async max(field: NumericFields, filter?: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter']) {
    const query = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value: e.max(model[field]),
    }));
    return await query.run(this.edgedbClient);
  }

  async update<
    Shape extends {
      filter?: SelectModifiers['filter'];
      filter_single?: SelectModifiers<ModelTypeSet['__element__']>['filter_single'];
      set: UpdateShape<ModelTypeSet>;
    },
  >(
    shape: (
      scope: $scopify<ModelTypeSet['__element__']
      >,
    ) => Readonly<Shape>,
  ) {
    return await e.update(this.model, shape).run(this.edgedbClient);
  }

  async updateMany(
    filter: (model: $scopify<ModelTypeSet['__element__']>) => SelectModifiers['filter'],
    set: UpdateShape<ModelTypeSet>,
  ) {
    return await e
      .update(this.model, (model) => ({
        filter: filter(model),
        set,
      }))
      .run(this.edgedbClient);
  }

  async insert(
    data: InsertShape<ModelTypeSet['__element__']
    >,
  ) {
    return await e.insert(this.model, data).run(this.edgedbClient);
  }

  async insertMany(
    data: InsertShape<ModelTypeSet['__element__']>[],
  ) {
    const inserts = data.map((d) => e.insert(this.model, d));
    // By iterating inside your query using e.for, you’re guaranteed everything will happen in a single query.
    const query = e.for(e.set(...inserts), (item) => {
      return item;
    });

    return await query.run(this.edgedbClient);
  }

  async delete(id: string) {
    return await e
      .delete(this.model, (model) => ({
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async deleteMany(ids: string[]) {
    return await e
      .delete(this.model, (model) => ({
        filter: e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), ids)),
        ),
      }))
      .run(this.edgedbClient);
  }
}
