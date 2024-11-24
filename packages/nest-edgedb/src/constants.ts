import { $expr_PathNode } from "./generated/syntax/reflection";

export const EDGE_DB_CLIENT = 'EDGE_DB_CLIENT';
export const ENTITY_MANAGER = 'ENTITY_MANAGER';
export const REPOSITORY = 'REPOSITORY';

export const getRepositoryToken = (model: $expr_PathNode) => `${REPOSITORY}_${model.__element__.__name__}`;
export const getEntityManagerToken = (models: readonly $expr_PathNode[]) => `${ENTITY_MANAGER}_${models.map(m => m.__element__.__name__).join('_')}`;