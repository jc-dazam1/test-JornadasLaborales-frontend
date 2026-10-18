export interface IDatabaseService {
  healthCheck(): Promise<boolean>;
  close(): Promise<void>;
}