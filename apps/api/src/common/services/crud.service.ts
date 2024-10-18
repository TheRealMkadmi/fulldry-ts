import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import {
  Expression,
  type $scopify,
} from 'dbschema/edgeql-js/typesystem';
import {
  objectTypeToSelectShape,
  SelectModifiers,
} from 'dbschema/edgeql-js/select';
import { insert, InsertShape } from '../../../dbschema/edgeql-js/insert';
import { $expr_PathNode, $linkPropify } from '../../../dbschema/edgeql-js/path';
import { Cardinality } from 'dbschema/edgeql-js/reflection';
import {
  Pet,
} from '../../../dbschema/edgeql-js/modules/default';
import { UpdateShape } from '../../../dbschema/edgeql-js/update';
import type * as _std from '../../../dbschema/edgeql-js/modules/std';

type ExtractTypeSet<T> = T extends $expr_PathNode<infer U, any> ? U : never;

type Model = typeof Pet;

// Structural elements
type ModelTypeSet = ExtractTypeSet<Model>;
type ModelShape = ModelTypeSet['__element__']['__pointers__'];

// Specifics
type BackLinks = {
  [K in keyof ModelShape as K extends `<${string}[${string}]`
  ? K
  : never]: ModelShape[K];
};

type NumericFields = {
  [K in keyof ModelShape]: ModelShape[K]['target'] extends _std.$number
  ? K
  : never;
}[keyof ModelShape];

// Computed
export type RunReturnType<E extends Expression> = E['run'] extends (
  ...args: any[]
) => infer R
  ? R
  : never;

export class CrudService {
  constructor(
    protected readonly edgedbClient: Client,
    protected readonly model: Model,
  ) { }

  async find<
    Expr extends ModelTypeSet,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
    Scope extends $scopify<Element> &
    $linkPropify<{
      [k in keyof Expr]: k extends '__cardinality__'
      ? Cardinality.One
      : Expr[k];
    }>,
  >(
    options?: {
      id?: string;
      ids?: string[];
      backlink?: keyof BackLinks;
      backlinkId?: string;
      shape?: (scope: Scope) => Readonly<Shape>;
      take?: number;
      skip?: number;
      filter?: (model: Scope) => SelectModifiers['filter'];
      filter_single?: (model: Scope) => SelectModifiers['filter_single'];
    },
  ): RunReturnType<typeof expr> {
    options = options || {};

    const expr = e.select(this.model, (model) => {
      const selection: any = {};

      // Projection
      if (options.shape) {
        Object.assign(selection, options.shape);
      } else {
        selection['...'] = model['*'];
      }

      // Filters
      if (options.id) {
        selection.filter_single = e.op(model.id, '=', e.uuid(options.id));
      } else if (options.ids) {
        selection.filter = e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), options.ids)),
        );
      } else if (options.backlink && options.backlinkId) {
        selection.filter = e.op(
          model[options.backlink]['id'],
          '=',
          e.uuid(options.backlinkId),
        );
      } else if (options.filter_single) {
        selection.filter_single = options.filter_single;
      } else if (options.filter) {
        selection.filter = options.filter;
      }

      // Pagination
      if (options.take !== undefined) {
        selection.limit = options.take;
      }
      if (options.skip !== undefined) {
        selection.offset = options.skip;
      }

      return selection;
    });

    return await expr.run(this.edgedbClient);
  }

  async count(
    filter?: (
      model: $scopify<ModelTypeSet['__element__']>,
    ) => SelectModifiers['filter'],
  ): Promise<number> {
    const expr = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    return await e.count(expr).run(this.edgedbClient);
  }

  async exists(
    filter?: (
      model: $scopify<ModelTypeSet['__element__']>,
    ) => SelectModifiers['filter'],
  ): Promise<boolean> {
    const expr = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
    }));
    const count = await e.count(expr).run(this.edgedbClient);
    return count > 0;
  }

  async adjust(
    id: string,
    field: NumericFields,
    value: number,
    operator: '+' | '-',
  ): RunReturnType<typeof expr> {
    const expr = e.update(this.model, (model) => ({
      filter_single: e.op(model.id, '=', e.uuid(id)),
      set: {
        [field]: e.op(model[field], operator, value),
      },
    }));

    return await expr.run(this.edgedbClient);
  }

  async increment(
    id: string,
    field: NumericFields,
    value: number = 1,
  ) {
    return this.adjust(id, field, value, '+');
  }

  async decrement(
    id: string,
    field: NumericFields,
    value: number = 1,
  ) {
    return this.adjust(id, field, value, '-');
  }

  async aggregate(
    field: NumericFields,
    operation: 'sum' | 'min' | 'max',
    filter?: (
      model: $scopify<ModelTypeSet['__element__']>,
    ) => SelectModifiers['filter'],
  ): RunReturnType<typeof expr> {
    const expr = e.select(this.model, (model) => ({
      filter: filter ? filter(model) : undefined,
      value:
        operation === 'sum'
          ? e.sum(model[field])
          : operation === 'min'
            ? e.min(model[field])
            : e.max(model[field]),
    }));
    return await expr.run(this.edgedbClient);
  }

  async update(
    options: {
      id?: string;
      ids?: string[];
      filter?: (
        model: $scopify<ModelTypeSet['__element__']>,
      ) => SelectModifiers['filter'];
      filter_single?: (
        model: $scopify<ModelTypeSet['__element__']>,
      ) => SelectModifiers['filter_single'];
      set: UpdateShape<ModelTypeSet>;
    },
  ): RunReturnType<typeof expr> {
    const expr = e.update(this.model, (model) => {
      const updateObj: any = {
        set: options.set,
      };

      if (options.id) {
        updateObj.filter_single = e.op(model.id, '=', e.uuid(options.id));
      } else if (options.ids) {
        updateObj.filter = e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), options.ids)),
        );
      } else if (options.filter_single) {
        updateObj.filter_single = options.filter_single(model);
      } else if (options.filter) {
        updateObj.filter = options.filter(model);
      }

      return updateObj;
    });

    return await expr.run(this.edgedbClient);
  }

  async insert(
    data:
      | InsertShape<ModelTypeSet['__element__']>
      | InsertShape<ModelTypeSet['__element__']>[],
  ) {
    if (Array.isArray(data)) {
      // Handle insertMany
      const inserts = data.map((d) => e.insert(this.model, d));
      const expr = e.for(e.set(...inserts), (item) => item);
      return await expr.run(this.edgedbClient);
    } else {
      // Handle single insert
      const expr = e.insert(this.model, data);
      return await expr.run(this.edgedbClient);
    }
  }

  async delete(
    options: {
      id?: string;
      ids?: string[];
      filter?: (
        model: $scopify<ModelTypeSet['__element__']>,
      ) => SelectModifiers['filter'];
      filter_single?: (
        model: $scopify<ModelTypeSet['__element__']>,
      ) => SelectModifiers['filter_single'];
    },
  ): RunReturnType<typeof expr> {
    const expr = e.delete(this.model, (model) => {
      const deleteObj: any = {};

      if (options.id) {
        deleteObj.filter_single = e.op(model.id, '=', e.uuid(options.id));
      } else if (options.ids) {
        deleteObj.filter = e.op(
          model.id,
          'in',
          e.array_unpack(e.literal(e.array(e.str), options.ids)),
        );
      } else if (options.filter_single) {
        deleteObj.filter_single = options.filter_single(model);
      } else if (options.filter) {
        deleteObj.filter = options.filter(model);
      }

      return deleteObj;
    });

    return await expr.run(this.edgedbClient);
  }
}
