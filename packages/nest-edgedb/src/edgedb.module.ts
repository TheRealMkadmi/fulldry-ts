import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { createClient } from 'edgedb';

export const EDGE_DB_CLIENT = 'EDGE_DB_CLIENT';

export type CreateClientOptions = Parameters<typeof createClient>[0];

@Global()
@Module({})
export class EdgeDBModule {
  static forRoot(options?: CreateClientOptions): DynamicModule {
    const clientProvider: Provider = {
      provide: EDGE_DB_CLIENT,
      useFactory: () => createClient(options),
    };

    return {
      module: EdgeDBModule,
      providers: [clientProvider],
      exports: [clientProvider],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<CreateClientOptions> | CreateClientOptions;
    inject?: any[];
  }): DynamicModule {
    const clientProvider: Provider = {
      provide: EDGE_DB_CLIENT,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return createClient(config);
      },
      inject: options.inject || [],
    };

    return {
      module: EdgeDBModule,
      providers: [clientProvider],
      exports: [clientProvider],
    };
  }
}
