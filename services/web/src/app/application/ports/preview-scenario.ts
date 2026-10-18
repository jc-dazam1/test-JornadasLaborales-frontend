import { DataState } from '../models/data-state';

export interface PreviewScenario {
  state(): DataState;
  setState(state: DataState): void;
}
