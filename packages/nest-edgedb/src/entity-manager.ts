import { Client } from "edgedb";
import { $expr_PathNode, SelectModifiers } from "./generated/syntax/syntax";
import e from './generated/syntax';
import { $overload, GenericFunction } from 'fulldry-utils';
import { $RenderFindAll, $RenderFindOneById, $RenderFindOneByIdWithProjection, findAll, findOneById, findOneByIdWithProjection } from "./repository/operations/select";

type ModelsTuple = [typeof e.Pet, typeof e.User];

const client = {} as Client;

const t = findAll(e.Pet, client);

export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
    findOneByIdWithProjection: $overload<TModels, $RenderFindOneByIdWithProjection> = findOneByIdWithProjection as any
    findOneById: $overload<TModels, $RenderFindOneById> = findOneById as any
}

const em = new EntityManager<ModelsTuple>();

const users = em.findAll(e.User, client);
const petNames = em.findOneByIdWithProjection(e.Pet, client, '1', (m) => ({
    name: m.name
}));




