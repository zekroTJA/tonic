/** @format */

import { EventEmitter } from 'events';

export interface SnackBarEvent {
  severity: 'error' | 'success' | 'info' | 'warning' | undefined;
  autoHideDuration?: number;
  content: JSX.Element | string;
}

export type SnackBarEventHandler = (e: SnackBarEvent) => void;

export default class SnackBarService extends EventEmitter {
  public onShow(handler: SnackBarEventHandler) {
    this.on('show', handler);
  }

  public show(e: SnackBarEvent) {
    this.emit('show', e);
  }
}
