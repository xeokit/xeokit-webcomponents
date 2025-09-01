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