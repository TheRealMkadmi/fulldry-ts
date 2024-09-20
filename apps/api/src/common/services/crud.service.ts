import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import {
  $scopify,
  ExclusiveTuple,
  LinkDesc,
  ObjectType,
  ObjectTypeExpression,
  ObjectTypePointers,
  PropertyDesc,
  setToTsType,
  TypeSet,
} from 'dbschema/edgeql-js/typesystem';
import { $expr_PathNode, Cardinality } from 'dbschema/edgeql-js/reflection';
import { $uuid } from 'dbschema/edgeql-js/modules/std';
import { $ObjectType } from 'dbschema/edgeql-js/modules/schema';
import { $PetλShape, $Pet, type Pet } from 'dbschema/edgeql-js/modules/default';
import {
  objectTypeToSelectShape,
  SelectModifiers,
} from 'dbschema/edgeql-js/select';
import { $linkPropify } from 'dbschema/edgeql-js/path';
import * as _ from 'dbschema/edgeql-js/imports';

export class CrudService<
  R extends ObjectType<string, ObjectTypePointers, null, ExclusiveTuple>,
  K extends R['__pointers__'] = R['__pointers__'],
  E extends R['__exclusives__'] = R['__exclusives__'],
> {
  constructor(
    protected readonly edgedbClient: Client,
    protected readonly model: typeof Pet,
  ) {
  }

  async findAll() {
    return await e
      .select(this.model, (m) => ({
        ...m['*'],
      }))
      .run(this.edgedbClient);
  }

  async findOneById(id: string) {
    return await e
      .select(this.model, (model) => ({
        ...model['*'],
        filter_single: e.op(model.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
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

  async findOneByIdProjection<
    Expr extends TypeSet<R>,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
  >(id: string, shape: Readonly<Shape>) {
    return await e
      .select(this.model, (pet) => ({
        ...shape,
        filter_single: e.op(pet.id, '=', e.uuid(id)),
      }))
      .run(this.edgedbClient);
  }

  async findManyByIdsProjection<
    Expr extends TypeSet<R>,
    Element extends Expr['__element__'],
    Shape extends objectTypeToSelectShape<Element> & SelectModifiers<Element>,
  >(ids: string[], shape: Readonly<Omit<Shape, 'filter_single'>>) {
    const query = e.select(this.model, (pet) => ({
      ...shape,
      filter: e.op(
        pet.id,
        'in',
        e.array_unpack(e.literal(e.array(e.str), ids)),
      ),
    }));
    return await query.run(this.edgedbClient);
  }
}
