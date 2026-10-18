import { AppConfig, loadConfig } from './config';
import { LocalPostgresDatabaseService, ManagedIdentityPostgresDatabaseService } from './database';
import { IDatabaseService } from './interfaces/IDatabaseService';

export interface ServiceRegistry {
  database: IDatabaseService;
}

let services: ServiceRegistry | null = null;

export function registerServices(registry: ServiceRegistry): void {
  services = registry;
}

export function clearServices(): void {
  services = null;
}

function initializeServices(config: AppConfig): ServiceRegistry {
  if (config.environment === 'Development') {
    if (!config.databaseUrl) throw new Error('DATABASE_URL is required in Development');
    return { database: new LocalPostgresDatabaseService(config.databaseUrl) };
  }

  if (!config.azurePostgresHost || !config.azurePostgresDatabase || !config.azurePostgresUser) {
    throw new Error('Azure PostgreSQL settings are required outside Development');
  }
  return {
    database: new ManagedIdentityPostgresDatabaseService(
      config.azurePostgresHost,
      config.azurePostgresDatabase,
      config.azurePostgresUser,
      config.azurePostgresPort,
    ),
  };
}

export function getServices(): ServiceRegistry {
  if (services === null) {
    services = initializeServices(loadConfig());
  }
  return services;
}