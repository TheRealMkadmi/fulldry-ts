import { Client } from "edgedb";
import { $expr_PathNode, SelectModifiers } from "./generated/syntax/syntax";
import e from './generated/syntax';
import { $overload } from 'fulldry-utils';
import { $RenderFindAll, $RenderFindOneByIdWithProjection, findAll, findOneByIdWithProjection } from "./repository/operations/select";



type ModelsTuple = [typeof e.Pet, typeof e.User];

const client = {} as Client;

const t = findAll(e.Pet, client);

export class EntityManager<TModels extends readonly $expr_PathNode[]> {
    findAll: $overload<TModels, $RenderFindAll> = findAll as any;
    findOneByIdWithProjection: $overload<TModels, $RenderFindOneByIdWithProjection> = findOneByIdWithProjection as any
}

const em = new EntityManager<ModelsTuple>();

const pets = em.findAll(e.Pet, client);
const petNames = em.findOneByIdWithProjection(e.Pet, client, '1', (m) => ({
    name: true
}))

