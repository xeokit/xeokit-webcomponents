import XeoViewer from "./xeo-viewer";
import XeoModel from "./xeo-model";
import XeoFastNav from "./xeo-fast-nav";
import XeoTreeView from "./xeo-tree-view";
import XeoTreeViewPanel from "./xeo-tree-view-panel";

import { XeoViewerService } from "./xeo-viewer-service";
export { XeoViewerService };

window.customElements.define("xeo-viewer", XeoViewer);
window.customElements.define("xeo-model", XeoModel);
window.customElements.define("xeo-fast-nav", XeoFastNav);
window.customElements.define("xeo-tree-view-panel", XeoTreeViewPanel);
window.customElements.define("xeo-tree-view", XeoTreeView);

document.addEventListener('DOMContentLoaded', () => {
  // Listen to model-loaded events
  const modelComponents = document.getElementsByTagName('xeo-model');
  Array.from(modelComponents).forEach((modelComponent) => {
    if (modelComponent.hasAttribute('@model-loaded')) {
      const callbackName = modelComponent.getAttribute('@model-loaded');
      if (callbackName) {
        // @ts-ignore custom event
        modelComponent?.addEventListener('model-loaded', (event: CustomEvent) => {
          if (typeof window[callbackName] === 'function') {
            window[callbackName](event);
          }
        });
      }
    }
  });

  // Listen to model-entity-clicked events
  const viewerComponents = document.getElementsByTagName('xeo-viewer');
  Array.from(viewerComponents).forEach((viewerComponent) => {
    if (viewerComponent.hasAttribute('@model-entity-clicked')) {
      const callbackName = viewerComponent.getAttribute('@model-entity-clicked');
      if (callbackName) {
        // @ts-ignore custom event
        viewerComponent?.addEventListener('model-entity-clicked', (event: CustomEvent) => {
          if (typeof window[callbackName] === 'function') {
            window[callbackName](event);
          }
        });
      }
    }
  });

  // Listen to tree-view-node-title-clicked events
  const treeViewComponents = document.getElementsByTagName('xeo-tree-view');
  Array.from(treeViewComponents).forEach((treeViewComponent) => {
    if (treeViewComponent.hasAttribute('@tree-view-node-title-clicked')) {
      const callbackName = treeViewComponent.getAttribute('@tree-view-node-title-clicked');
      if (callbackName) {
        // @ts-ignore custom event
        treeViewComponent?.addEventListener('tree-view-node-title-clicked', (event: CustomEvent) => {
          if (typeof window[callbackName] === 'function') {
            window[callbackName](event);
          }
        });
      }
    }
  });

});