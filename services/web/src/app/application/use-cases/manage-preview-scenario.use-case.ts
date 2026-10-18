import { DataState } from '../models/data-state';
import { PreviewScenario } from '../ports/preview-scenario';

export class ManagePreviewScenarioUseCase {
  constructor(private readonly preview: PreviewScenario) {}

  state() {
    return this.preview.state();
  }

  setState(state: DataState): void {
    this.preview.setState(state);
  }
}