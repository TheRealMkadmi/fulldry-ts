import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { createClient, Client } from 'edgedb';
import { EDGE_DB_CLIENT } from './constants';
import { EdgeDbClientProvider } from './providers';

@Global()
@Module({})
export class EdgeDBModule {
  static forRoot(options?: Parameters<typeof createClient>[0]): DynamicModule {
    return {
      module: EdgeDBModule,
      providers: [
        EdgeDbClientProvider,
      ],
      exports: [
        EdgeDbClientProvider,
      ],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<Parameters<typeof createClient>[0]> | Parameters<typeof createClient>[0];
    inject?: any[];
  }): DynamicModule {
    const asyncClientProvider: Provider = {
      provide: EDGE_DB_CLIENT,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return createClient(config);
      },
      inject: options.inject || [],
    };

    return {
      module: EdgeDBModule,
      providers: [
        asyncClientProvider,
      ],
      exports: [
        asyncClientProvider,
      ],
    };
  }
}
