import XeoViewer from "./xeo-viewer";
import XeoModel from "./xeo-model";
import XeoFastNav from "./xeo-fast-nav";
import {XeoObjectsTreeView, XeoClassesTreeView, XeoStoreysTreeView } from "./xeo-tree-view";
import XeoTreeViewPanel from "./xeo-tree-view-panel";

window.customElements.define("xeo-viewer", XeoViewer);
window.customElements.define("xeo-model", XeoModel);
window.customElements.define("xeo-fast-nav", XeoFastNav);
window.customElements.define("xeo-tree-view-panel", XeoTreeViewPanel);
window.customElements.define("xeo-objects-tree-view", XeoObjectsTreeView);
window.customElements.define("xeo-storeys-tree-view", XeoStoreysTreeView);
window.customElements.define("xeo-classes-tree-view", XeoClassesTreeView);