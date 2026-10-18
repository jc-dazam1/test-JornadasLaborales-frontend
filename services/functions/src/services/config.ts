export interface AppConfig {
  environment: string;
  databaseUrl?: string;
  azurePostgresHost?: string;
  azurePostgresDatabase?: string;
  azurePostgresUser?: string;
  azurePostgresPort: number;
}

function requireSetting(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function loadConfig(): AppConfig {
  const environment = process.env['AZURE_FUNCTIONS_ENVIRONMENT'] ?? 'Production';
  if (environment === 'Development') {
    return {
      environment,
      databaseUrl: requireSetting('DATABASE_URL'),
      azurePostgresPort: 5432,
    };
  }

  const portValue = process.env['AZURE_POSTGRES_PORT'] ?? '5432';
  const azurePostgresPort = Number(portValue);
  if (!Number.isInteger(azurePostgresPort) || azurePostgresPort < 1 || azurePostgresPort > 65535) {
    throw new Error('AZURE_POSTGRES_PORT must be a valid TCP port');
  }

  return {
    environment,
    azurePostgresHost: requireSetting('AZURE_POSTGRES_HOST'),
    azurePostgresDatabase: requireSetting('AZURE_POSTGRES_DATABASE'),
    azurePostgresUser: requireSetting('AZURE_POSTGRES_USER'),
    azurePostgresPort,
  };
}