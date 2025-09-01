import { type Viewer } from '@xeokit/xeokit-sdk';

interface Viewers {
  [key: string]: Viewer;
}

export class XeoViewerService {
  static instance: XeoViewerService;
  _viewers: Viewers;

  constructor() {
    this._viewers = {};
  }

  static getInstance() {
    if (!XeoViewerService.instance) {
      XeoViewerService.instance = new XeoViewerService();
    }
    return XeoViewerService.instance;
  }

  setViewer(viewer: Viewer, id: string) {
    if (!this._viewers) return;

    if (viewer) {
      this._viewers[id] = viewer;
    }
  }

  getViewer(id: string) {
    if (!this._viewers) return null;

    if (!this._viewers[id]) {
      return null;
    }
    return this._viewers[id];
  }
}