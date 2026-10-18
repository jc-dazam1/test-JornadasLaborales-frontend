import { DefaultAzureCredential } from '@azure/identity';
import { Pool } from 'pg';
import { IDatabaseService } from './interfaces/IDatabaseService';

export class LocalPostgresDatabaseService implements IDatabaseService {
  private readonly pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString, connectionTimeoutMillis: 3000, max: 5 });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export class ManagedIdentityPostgresDatabaseService implements IDatabaseService {
  private readonly credential = new DefaultAzureCredential();
  private readonly pool: Pool;

  constructor(host: string, database: string, user: string, port: number) {
    this.pool = new Pool({
      host,
      database,
      user,
      port,
      ssl: { rejectUnauthorized: true },
      connectionTimeoutMillis: 5000,
      max: 5,
      password: async () => {
        const accessToken = await this.credential.getToken('https://ossrdbms-aad.database.windows.net/.default');
        if (!accessToken) throw new Error('Could not acquire a PostgreSQL access token');
        return accessToken.token;
      },
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}