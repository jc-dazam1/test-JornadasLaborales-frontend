import { Injectable, signal } from '@angular/core';
import { DataState } from './api/models';

const allowedStates: DataState[] = ['data', 'loading', 'empty', 'error'];

@Injectable({ providedIn: 'root' })
export class PreviewStateService {
  readonly state = signal<DataState>(this.readInitialState());

  setState(state: DataState): void {
    this.state.set(state);
    localStorage.setItem('previewState', state);
    window.location.reload();
  }

  private readInitialState(): DataState {
    const queryState = new URLSearchParams(window.location.search).get('previewState');
    const storedState = localStorage.getItem('previewState');
    const requestedState = queryState ?? storedState;
    return requestedState && allowedStates.includes(requestedState as DataState)
      ? (requestedState as DataState)
      : 'data';
  }
}