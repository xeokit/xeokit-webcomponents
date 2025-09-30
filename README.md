# xeokit-webcomponents

How to use xeokit webcomponents: https://xeokit.io/blog/building-3d-model-viewers-with-xeokit-webcomponents

Example:
```html
<xeo-viewer id="viewer-1" transparent="true">
  <xeo-model src="https://sos-ch-gva-2.exo.io/creoox-public/example-no-1.xkt" id="model-1" bounding-box="true" show-edges="true"></xeo-model>
</xeo-viewer>
```

## &lt;xeo-viewer&gt;
*   `id`: A unique ID for the viewer instance.
*   `transparent`: (Optional) Control the viewer background transparency (Default: false).
*   `show-edges`: (Optional) Show edges (default false)
*   `dtx-enabled`: (Optional) Whether data texture-based scene representation (DTX) is enabled (default false)
*   `color-texture-enabled`: (Optional) Whether basic color texture rendering is enabled (default false)
*   `nav-cube-enabled`: (Optional) Whether navcube plugin is enabled (default false)
*   `nav-cube-position`: (Optional) Position of navcube (default bottom-left)
*   `@model-entity-clicked`: (Optional) Callback function when entity was clicked (Event argument provides detail)

## &lt;xeo-model&gt;
*   `src`: The URL to your 3D model or data string (`data:application/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAAdp...`)
      Use model type prefixes to force loader type: (available types: `gltf/glb/las/laz/obj/stl/bim/ifc`) (Example: `src="laz;https://localhost:3000/point-cloud-model"`)
*   `id`: Unique id of your model
*   `bounding-box`: (Optional) Displays the bounding box of the loaded model. This is useful for debugging or visualizing model extents. (Default: false)
*   `show-edges`: (Optional) Whether or not to show edges (Default: false)
*   `dtx-enabled`: (Optional) Whether data texture scene representation (DTX) is enabled (Default: false)
*   `color-texture-enabled`: (Optional) Whether basic color texture rendering is enabled (Default: false)
*   `sao-enabled`: (Optional) Whether SAO (Scalable Ambient Obscurance) is enabled (Default: false)
*   `rotation`: (Optional) Initial rotation of model (Default: [0, 0, 0])
*   `fp64`: (Optional) Whether floating point precision for point cloud models is enabled (Default: false)
*   `@model-loaded`: (Optional) Callback function when model was loaded (Event argument provides detail)

## &lt;xeo-tree-view-panel&gt; &lt;xeo-tree-view&gt;
*   `<xeo-tree-view-panel>`: A container for one or more tree views.
    *   `width`: Sets the width of the panel.
    *   `bgColor`: Sets the background color using an RGBA value for transparency.
    *   `position`: Panel position, left or right side of a page. (Default: right)
*   `<xeo-tree-view>`: Renders a tree view of the loaded models. You can have multiple `xeo-tree-view` elements, each displaying a different hierarchy.
    *   `id`: Unique id of tree view
    *   `hierarchy`: Defines the hierarchy type. Common values include:
        *   `"containment"`: Based on IFC spatial containment.
        *   `"types"`: Grouped by IFC types.
        *   `"storeys"`: Grouped by IFC storeys.
    *   `autoExpandDepth`: Specifies how many levels of the tree should be automatically expanded on load. (Default: 0)
    *   `@tree-view-node-title-clicked`: (Optional) Callback function when tree view node was clicked (Event argument provides detail)
 
## &lt;xeo-fast-nav&gt;
Viewer plugin that makes interaction smoother with large models, by temporarily switching the Viewer to faster, lower-quality rendering modes whenever we interact.
* `hide-edges`: Don't show edges while we interact (Default: true) (Optional)
* `hide-sao`:  Don't show ambient shadows while we interact (Default: true) (Optional)
* `hide-pbr`: No physically-based rendering while we interact (Default: true) (Optional)
* `hide-color-texture`: No color textures while we interact (Default: true) (Optional)
* `hide-transparent-objects`: Hide transparent objects while we interact (Default: false) (Optional)
* `scale-canvas-resolution`: Scale canvas resolution while we interact (Default: true) (Optional)
* `scale-canvas-resolution-factor`: Factor by which we scale canvas resolution when we interact (Default: 0.8) (Optional)
* `delay-before-restore`: When we stop interacting, delay before restoring normal render (Default: true) (Optional)
* `delay-before-restore-seconds`: The delay duration, in seconds (Default is 0.5) (Optional)
