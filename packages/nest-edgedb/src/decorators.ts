import { Inject } from '@nestjs/common';
import { getRepositoryToken, getEntityManagerToken, EDGE_DB_CLIENT } from './constants';
import { $expr_PathNode } from './generated/syntax/reflection';

export const InjectEdgeDbClient = () => Inject(EDGE_DB_CLIENT);
export const InjectEntityManager = (...models: readonly $expr_PathNode[]) => Inject(getEntityManagerToken(models));
export const InjectRepository = (model: $expr_PathNode) => Inject(getRepositoryToken(model));