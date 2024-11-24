import { Provider } from '@nestjs/common';
import createClient, { Client } from 'edgedb';
import { EntityManager, NarrowEntityManager } from './entity-manager';
import { createRepository } from './repository';
import { EDGE_DB_CLIENT, getRepositoryToken, getEntityManagerToken } from './constants';
import { $expr_PathNode } from './generated/syntax/syntax';

export const EdgeDbClientProvider: Provider = {
    provide: EDGE_DB_CLIENT,
    useFactory: (options?: Parameters<typeof createClient>[0]) => {
        return createClient(options);
    },
    inject: [],
};

export const createEntityManagerProvider = (models: readonly $expr_PathNode[]): Provider => ({
    provide: getEntityManagerToken(models),
    useFactory: () => {
        return new EntityManager<typeof models>();
    },
    inject: [EDGE_DB_CLIENT],
});

export const createRepositoryProvider = (model: $expr_PathNode): Provider => ({
    provide: getRepositoryToken(model),
    useFactory: (entityManager: NarrowEntityManager<typeof model>, client: Client) => {
        return createRepository(model, entityManager, client);
    },
    inject: [getEntityManagerToken([model])],
});
