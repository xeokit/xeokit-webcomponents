import { XeoViewerService } from "./xeo-viewer-service";
import { Viewer, buildBoxLinesGeometryFromAABB, Mesh, PhongMaterial, ReadableGeometry, VBOSceneModel, Node } from "@xeokit/xeokit-sdk";
import { XKTLoaderPlugin, LASLoaderPlugin, OBJLoaderPlugin, GLTFLoaderPlugin, STLLoaderPlugin, DotBIMLoaderPlugin } from "@xeokit/xeokit-sdk";
import { ifc2gltf } from '@creooxag/cxconverter';

class XeoModel extends HTMLElement {
  src: string;
  type: string | undefined;
  viewerId: string | null | undefined;
  showEdges: boolean;
  dtxEnabled: boolean;
  colorTextureEnabled: boolean;
  saoEnabled: boolean;
  rotation: number[];
  fp64: boolean;
  boundingBox: boolean;

  constructor() {
    super();
    this.src = "";
    this.type = "";
    this.viewerId = "";
    this.showEdges = false;
    this.dtxEnabled = false;
    this.colorTextureEnabled = false;
    this.saoEnabled = false;
    this.rotation = [0, 0, 0];
    this.fp64 = false;
    this.boundingBox = false;
  }

  static get observedAttributes() {
    return ["src", "show-edges", "dtx-enabled", "color-texture-enabled", "sao-enabled", "rotation", "fp64", "bounding-box"];
  }

  drawModelBoundingBox(viewer: Viewer, sceneModelId: string) {

    const model = viewer.scene.models[sceneModelId];

    if (!model) return;

    if (!viewer.scene.objects[`${sceneModelId}#boundingBox`]) {
      new Mesh(viewer.scene, {
        id: `${sceneModelId}#boundingBox`,
        isObject: true,
        geometry: new ReadableGeometry(viewer.scene, buildBoxLinesGeometryFromAABB({ aabb: model.aabb })),
        material: new PhongMaterial(viewer.scene, { ambient: [255, 0, 0] }),
      });
    }
  }

  handleLoaded(sceneModel: VBOSceneModel) {
    const ce = new CustomEvent('model-loaded', {
      bubbles: true,
      composed: true,
      detail: { model: sceneModel }
    });

    this.dispatchEvent(ce);
  }

  async connectedCallback() {
    this.viewerId = this.parentElement!.getAttribute("id");
    if (!this.viewerId) return;

    const viewer = XeoViewerService.getInstance().getViewer(this.viewerId);

    if (!viewer) return;

    if (!this.hasAttribute("src")) {
      console.error("Please provide an src attribute!");
    } else {

      let split = this.getAttribute("src")!.split(';');
      this.type = split[0];
      this.src = split[1];

      if (!this.src) {
        this.src = this.type;
        this.type = this.src.split('.').pop();
      }
    }

    // if (this.hasAttribute("@model-loaded")) {
    //   this.addEventListener("model-loaded", (e: any) => {
    //     console.log("Model loaded EVENT:", e.detail.model);
    //   });
    // }

    if (this.hasAttribute("show-edges")) {
      this.showEdges = this.getAttribute("show-edges") === 'true' || this.getAttribute("show-edges") === '1';
    }

    if (this.hasAttribute("dtx-enabled")) {
      this.dtxEnabled = this.getAttribute("dtx-enabled") === 'true' || this.getAttribute("dtx-enabled") === '1';
    }

    if (this.hasAttribute("color-texture-enabled")) {
      this.colorTextureEnabled = this.getAttribute("color-texture-enabled") === 'true' || this.getAttribute("color-texture-enabled") === '1';
    }

    if (this.hasAttribute("sao-enabled")) {
      this.saoEnabled = this.getAttribute("sao-enabled") === 'true' || this.getAttribute("sao-enabled") === '1';
    }

    if (this.hasAttribute("rotation")) {
      this.rotation = this.getAttribute("rotation")!.split(',').map(Number);
    }

    if (this.hasAttribute("fp64")) {
      this.fp64 = this.getAttribute("fp64") === 'true' || this.getAttribute("fp64") === '1';
    }

    if (this.hasAttribute("bounding-box")) {
      this.boundingBox = this.getAttribute("bounding-box") === 'true' || this.getAttribute("bounding-box") === '1';
    }

    const self = this;

    if (this.type === 'xkt') {
      const loader = new XKTLoaderPlugin(viewer);
      const t0 = performance.now();

      const currentModelId = "myXKTModel" + Math.random();
      const sceneModel = loader.load({
        id: currentModelId,
        src: this.src,
        edges: this.showEdges,
      });


      sceneModel.on("loaded", function () {
        self.handleLoaded(sceneModel);
        const t1 = performance.now();
        console.log(`XKT Model loaded in ${Math.floor(t1 - t0) / 1000.0} seconds, Objects: ${sceneModel.numEntities}`);

        self.viewToFit(viewer);

        if (self.boundingBox) {
          self.drawModelBoundingBox(viewer, currentModelId);
        }
      });
    } else if (this.type === 'las' || this.type === 'laz') {
      const loader = new LASLoaderPlugin(viewer, {
        rotate: [-90, 0, 0],
        fp64: this.fp64 ? 1 : 0,
      });

      const t0 = performance.now();
      const currentModelId = "myLASModel" + Math.random();

      const sceneModel = loader.load({
        id: currentModelId,
        src: this.src,
      });

      sceneModel.on("loaded", function () {
        self.handleLoaded(sceneModel);
        const t1 = performance.now();
        console.log(`LAS Model loaded in ${Math.floor(t1 - t0) / 1000.0} seconds, Objects: ${sceneModel.numEntities}`);

        self.viewToFit(viewer);

        if (self.boundingBox) {
          self.drawModelBoundingBox(viewer, currentModelId);
        }
      });
    } else if (this.type === 'obj') {
      const loader = new OBJLoaderPlugin(viewer, {
        id: 'myOBJModel',
      });

      const t0 = performance.now();
      const currentModelId = "myOBJModel" + Math.random();

      const sceneModel = loader.load({
        id: currentModelId,
        src: this.src,
      });

      sceneModel.on("loaded", function () {
        const ce = new CustomEvent('model-loaded', {
          bubbles: true,
          composed: true,
          detail: { model: sceneModel }
        });

        this.dispatchEvent(ce);

        const t1 = performance.now();
        console.log(`OBJ Model loaded in ${Math.floor(t1 - t0) / 1000.0} seconds`);

        self.viewToFit(viewer);

        if (self.boundingBox) {
          self.drawModelBoundingBox(viewer, currentModelId);
        }
      });
    } else if (this.type === 'gltf' || this.type === 'glb') {
      const loader = new GLTFLoaderPlugin(viewer);

      const t0 = performance.now();
      const currentModelId = "myGLTFModel" + Math.random();

      const sceneModel = loader.load({
        id: currentModelId,
        src: this.src,
        autoMetaModel: true,
        //colorTextureEnabled: this.colorTextureEnabled,
        //saoEnabled: this.saoEnabled,
        edges: this.showEdges,
        //dtxEnabled: this.dtxEnabled
      });

      sceneModel.on("loaded", function () {
        self.handleLoaded(sceneModel);
        const t1 = performance.now();
        console.log(`GLTF Model loaded in ${Math.floor(t1 - t0) / 1000.0} seconds, Objects: ${sceneModel.numEntities}`);

        self.viewToFit(viewer);

        if (self.boundingBox) {
          self.drawModelBoundingBox(viewer, currentModelId);
        }
      });
    } else if (this.type === 'stl') {
      const loader = new STLLoaderPlugin(viewer);

      const t0 = performance.now();
      const currentModelId = "mySTLModel" + Math.random();

      const sceneModel = loader.load({
        id: currentModelId,
        src: this.src,
      });

      sceneModel.on("loaded", function () {
        self.handleLoaded(sceneModel);
        const t1 = performance.now();
        console.log(`STL Model loaded in ${Math.floor(t1 - t0) / 1000.0} seconds, Objects: ${sceneModel.numEntities}`);

        self.viewToFit(viewer);

        if (self.boundingBox) {
          self.drawModelBoundingBox(viewer, currentModelId);
        }
      });
    } else if (this.type === 'bim') {
      const loader = new DotBIMLoaderPlugin(viewer);

      const t0 = performance.now();
      const currentModelId = "myDotBIMModel" + Math.random();

      const sceneModel = loader.load({
        id: currentModelId,
        src: this.src,
        //saoEnabled: this.saoEnabled,
        //edges: this.edges,
        rotation: this.rotation
      });

      sceneModel.on("loaded", function () {
        self.handleLoaded(sceneModel);
        const t1 = performance.now();
        console.log(`DotBIM Model loaded in ${Math.floor(t1 - t0) / 1000.0} seconds, Objects: ${sceneModel.numEntities}`);

        self.viewToFit(viewer);

        if (self.boundingBox) {
          self.drawModelBoundingBox(viewer, currentModelId);
        }
      });
    } else if (this.type === 'ifc') {
      const loader = new GLTFLoaderPlugin(viewer);
      const uint8Array = await this.downloadUrlToUint8Array(this.src) as string;

      const options = JSON.stringify(
        {
          inputParameters: {
            exportPropertySets: "yes",
            exportIfcPropertyTypes: "yes",
            exportIfcValueTypes: "yes",
            exportPolylines: "yes",
            excludeGeometryForIfcTypes: ["IfcOpeningElement"],
            exportGeometryOnlyForIfcTypes: [""],
            excludeGUIDs: [""],
            exportOnlyGUIDs: [""],
            centerModelAtOrigin: "no",
            ignoreProfileRadius: "yes",
            enableGltfCompression: "yes",
            enableGltfQuantization: "no",
            exportNormals: "no",
            numPointsPerCircle: 18,
            licenceKey: "",
            // JSON above is copied from default input config file. Changes applied here:
            loadingPriorityTypes: ["IFCWALL", "IFCSLAB", "IFCWINDOW", "IFCROOF", "IFCFURNISHINGELEMENT", "IFCAIRTERMINAL"]//[ "IfcOpeningElement" ],
          }
        });

      const { gltf, metaData } = await ifc2gltf(uint8Array, { remote: true, inputOptions: options });

      const t0 = performance.now();
      const currentModelId = "myIFCModel" + Math.random();

      const sceneModel = await loader.load({
        id: currentModelId,
        gltf: gltf,
        // @ts-ignore xeokit
        metaModelJSON: metaData,
      });

      sceneModel.on("loaded", function () {
        self.handleLoaded(sceneModel);
        const t1 = performance.now();
        console.log(`IFC Model loaded in ${Math.floor(t1 - t0) / 1000.0} seconds, Objects: ${sceneModel.numEntities}`);

        self.viewToFit(viewer);

        if (self.boundingBox) {
          self.drawModelBoundingBox(viewer, currentModelId);
        }
      });
    }
  }

  viewToFit(viewer: Viewer) {
    viewer.cameraFlight.jumpTo({
      projection: "perspective",
      aabb: viewer.scene.getAABB([]),
    });
  }

  async downloadUrlToUint8Array(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const file = new File([arrayBuffer], 'model.ifc', { type: 'application/octet-stream' });
      const fileReader = new FileReader();

      const uint8ArrayPromise = new Promise((resolve, reject) => {
        fileReader.onload = () => {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          resolve(uint8Array);
        };

        fileReader.onerror = () => reject(new Error('Failed to read file'));
      });

      fileReader.readAsArrayBuffer(file);

      const uint8Array = await uint8ArrayPromise;

      return uint8Array;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}

export default XeoModel;
