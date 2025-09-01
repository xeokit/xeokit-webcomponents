import { XeoViewerService } from "./xeo-viewer-service";
import { Viewer, NavCubePlugin } from "@xeokit/xeokit-sdk";

const template = document.createElement("template");
template.innerHTML = `
    <div class="xeokit-container">
      <!-- <div id="xeokit-spinner-element">spinner</div> -->
      <canvas id="xeokit-canvas"></canvas>
      <canvas id="xeokit-canvas-cube"></canvas>
    </div>
    <style>

    :host {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    :host a {
      text-decoration: none;
      color: black;
    }

    :host ul {
      padding-left: 15px;
    }

    :host ul, li {
      list-style-type: none;
    }

    #xeokit-canvas {
      display: block;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: lightblue;
      background-image: linear-gradient(lightblue, white);
    }

    .xeokit-container { display: block; margin: 0; padding: 0; width: 100%; height: 100%; position: relative; }
    .sk-fading-circle { background: transparent; margin: 20px auto; width: 50px; height:50px; position: relative; }
    .sk-fading-circle .sk-circle { width: 120%; height: 120%; position: absolute; left: 0; top: 0; }
    .sk-fading-circle .sk-circle:before { content: ''; display: block; margin: 0 auto; width: 15%; height: 15%; background-color: #ff8800; border-radius: 100%; -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both; animation: sk-circleFadeDelay 1.2s infinite ease-in-out both; }
    .sk-fading-circle .sk-circle2 { -webkit-transform: rotate(30deg); -ms-transform: rotate(30deg); transform: rotate(30deg); }
    .sk-fading-circle .sk-circle3 { -webkit-transform: rotate(60deg); -ms-transform: rotate(60deg); transform: rotate(60deg); }
    .sk-fading-circle .sk-circle4 { -webkit-transform: rotate(90deg); -ms-transform: rotate(90deg); transform: rotate(90deg); }
    .sk-fading-circle .sk-circle5 { -webkit-transform: rotate(120deg); -ms-transform: rotate(120deg); transform: rotate(120deg); }
    .sk-fading-circle .sk-circle6 { -webkit-transform: rotate(150deg); -ms-transform: rotate(150deg); transform: rotate(150deg); }
    .sk-fading-circle .sk-circle7 { -webkit-transform: rotate(180deg); -ms-transform: rotate(180deg); transform: rotate(180deg); }
    .sk-fading-circle .sk-circle8 { -webkit-transform: rotate(210deg); -ms-transform: rotate(210deg); transform: rotate(210deg); }
    .sk-fading-circle .sk-circle9 { -webkit-transform: rotate(240deg); -ms-transform: rotate(240deg); transform: rotate(240deg); }
    .sk-fading-circle .sk-circle10 { -webkit-transform: rotate(270deg); -ms-transform: rotate(270deg); transform: rotate(270deg); }
    .sk-fading-circle .sk-circle11 { -webkit-transform: rotate(300deg); -ms-transform: rotate(300deg); transform: rotate(300deg); }
    .sk-fading-circle .sk-circle12 { -webkit-transform: rotate(330deg); -ms-transform: rotate(330deg); transform: rotate(330deg); }
    .sk-fading-circle .sk-circle2:before { -webkit-animation-delay: -1.1s; animation-delay: -1.1s; }
    .sk-fading-circle .sk-circle3:before { -webkit-animation-delay: -1s; animation-delay: -1s; }
    .sk-fading-circle .sk-circle4:before { -webkit-animation-delay: -0.9s; animation-delay: -0.9s; }
    .sk-fading-circle .sk-circle5:before { -webkit-animation-delay: -0.8s; animation-delay: -0.8s; }
    .sk-fading-circle .sk-circle6:before { -webkit-animation-delay: -0.7s; animation-delay: -0.7s; }
    .sk-fading-circle .sk-circle7:before { -webkit-animation-delay: -0.6s; animation-delay: -0.6s; }
    .sk-fading-circle .sk-circle8:before { -webkit-animation-delay: -0.5s; animation-delay: -0.5s; }
    .sk-fading-circle .sk-circle9:before { -webkit-animation-delay: -0.4s; animation-delay: -0.4s; }
    .sk-fading-circle .sk-circle10:before { -webkit-animation-delay: -0.3s; animation-delay: -0.3s; }
    .sk-fading-circle .sk-circle11:before { -webkit-animation-delay: -0.2s; animation-delay: -0.2s; }
    .sk-fading-circle .sk-circle12:before { -webkit-animation-delay: -0.1s; animation-delay: -0.1s; }
    @-webkit-keyframes sk-circleFadeDelay { 0%, 39%, 100% { opacity: 0; } 40% { opacity: 1; } }
    @keyframes sk-circleFadeDelay { 0%, 39%, 100% { opacity: 0; } 40% { opacity: 1; } }

    #xeokit-canvas-cube {
    position: absolute;
    box-sizing: border-box;
    display: block;
    height: 150px;
    width: 150px;
    left: 25px;
    overflow-x: clip;
    overflow-y: clip;
    top: 25px;
    visibility; visible;
    }

    #xeokit-spinner-element {
      position: absolute;
      top: 50%;
      left: 50%;
    }
</style>`;


class XeoViewer extends HTMLElement {
  transparent: boolean;
  dtxEnabled: boolean;
  colorTextureEnabled: boolean;
  _shadowRoot: ShadowRoot;
  customEvent: CustomEvent;

  constructor() {
    super();

    //this._shadowRoot = this.attachShadow({ mode: "open" });

    this.transparent = false;
    this.dtxEnabled = false;
    this.colorTextureEnabled = false;

    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template.content.cloneNode(true));
  }

  initViewer = () => {
    const canvas = this.shadowRoot!.querySelector("#xeokit-canvas") as HTMLCanvasElement;
    const spinner = this.shadowRoot!.querySelector("#xeokit-spinner-element") as HTMLDivElement;
    const canvasCube = this.shadowRoot!.querySelector("#xeokit-canvas-cube") as HTMLCanvasElement;



    const viewer = new Viewer({
      canvasElement: canvas,
      transparent: this.transparent,
      dtxEnabled: this.dtxEnabled,
      colorTextureEnabled: this.colorTextureEnabled,
      //spinnerElementId: spinner.id,
    });

    viewer.scene.xrayMaterial.fill = true;
    viewer.scene.xrayMaterial.fillAlpha = 0.1;
    viewer.scene.xrayMaterial.fillColor = [0, 0, 0];
    viewer.scene.xrayMaterial.edgeAlpha = 0.3;
    viewer.scene.xrayMaterial.edgeColor = [0, 0, 0];

    viewer.scene.highlightMaterial.fill = true;
    viewer.scene.highlightMaterial.edges = true;
    viewer.scene.highlightMaterial.fillAlpha = 0.1;
    viewer.scene.highlightMaterial.edgeAlpha = 0.1;
    viewer.scene.highlightMaterial.edgeColor = [1, 1, 0];

    viewer.scene.selectedMaterial.fill = true;
    viewer.scene.selectedMaterial.edges = true;
    viewer.scene.selectedMaterial.fillAlpha = 0.5;
    viewer.scene.selectedMaterial.edgeAlpha = 0.6;
    viewer.scene.selectedMaterial.edgeColor = [0, 1, 1];

    viewer.cameraControl.navMode = "orbit";
    viewer.cameraControl.followPointer = true;

    viewer.cameraFlight.jumpTo({ projection: 'ortho' }); // ortho

    const navCubePlugin = new NavCubePlugin(viewer, {
      //canvasId: "xeokit-canvas-cube",
      canvasElement: canvasCube,
      color: "lightblue",
      cameraFly: true,       // Fly camera to each selected axis/diagonal
      cameraFitFOV: 45,        // How much field-of-view the scene takes once camera has fitted it to view
      cameraFlyDuration: 0.5,
      shadowVisible: false,
    });

    viewer.scene.input.on("mouseclicked", (coords) => {
      const hit = viewer.scene.pick({
        canvasPos: coords
      });

      if (hit && hit.entity && hit.entity.isObject) {
        const entity = hit.entity;
        const metaObject = viewer.metaScene.metaObjects[entity.id];

        if (metaObject) {
          this.customEvent = new CustomEvent('model-entity-clicked', {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: { entity, metaObject }
          });

          this.dispatchEvent(this.customEvent);
        }
      }
    });

    XeoViewerService.getInstance().setViewer(viewer, this.id);
  };

  static get observedAttributes() {
    return ["id", "transparent", "dtx-enabled", "color-texture-enabled"];
  }

  connectedCallback() {
    if (!this.hasAttribute("id")) {
      console.error("Please provide an id for viewer");
    }

    if (this.hasAttribute("transparent")) {
      this.transparent = this.getAttribute("transparent") === "true" || this.getAttribute("transparent") === '1';
    }

    if (this.hasAttribute("dtx-enabled")) {
      this.dtxEnabled = this.getAttribute("dtx-enabled") === "true" || this.getAttribute("dtx-enabled") === '1';
    }

    if (this.hasAttribute("color-texture-enabled")) {
      this.colorTextureEnabled = this.getAttribute("color-texture-enabled") === "true" || this.getAttribute("color-texture-enabled") === '1';
    }

    // if (this.hasAttribute("@model-entity-clicked")) {
    //   console.log("Model entity clicked listener added!!!");
    //   this.addEventListener("model-entity-clicked", (e: any) => {
    //     console.log('model-entity-clicked', { e });
    //     //e();
    //     //console.log("Model entity clicked EVENT:", e.detail.model);
    //   });
    // }

    this.initViewer();
  }
}

export default XeoViewer;
