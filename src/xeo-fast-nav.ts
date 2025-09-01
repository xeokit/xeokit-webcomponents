import { XeoViewerService } from "./xeo-viewer-service";
import { FastNavPlugin } from "@xeokit/xeokit-sdk";

class XeoFastNav extends HTMLElement {
  viewerId: string | null | undefined;
  hideEdges: boolean;
  hideSAO: boolean;
  hidePBR: boolean;
  hideColorTexture: boolean;
  hideTransparentObjects: boolean;
  scaleCanvasResolution: boolean;
  scaleCanvasResolutionFactor: number;
  delayBeforeRestore: boolean;
  delayBeforeRestoreSeconds: number;

  constructor() {
    super();

    this.hideEdges = true;
    this.hideSAO = true;
    this.hidePBR = true;
    this.hideColorTexture = true;
    this.hideTransparentObjects = false;
    this.scaleCanvasResolution = true;
    this.scaleCanvasResolutionFactor = 0.8;
    this.delayBeforeRestore = true;
    this.delayBeforeRestoreSeconds = 0.4;
  }

  static get observedAttributes() {
    return ["hide-edges", "hide-sao", "hide-pbr", "hide-color-texture", "hide-transparent-objects", "scale-canvas-resolution", "scale-canvas-resolution-factor", "delay-before-restore", "delay-before-restore-seconds"];
  }

  async connectedCallback() {
    this.viewerId = this.parentElement?.getAttribute("id");
    if (!this.viewerId) return;

    const viewer = XeoViewerService.getInstance().getViewer(this.viewerId);
    if (!viewer) return;

    if (this.hasAttribute("hide-edges")) {
      this.hideEdges = this.getAttribute("hide-edges") === "true" || this.getAttribute("hide-edges") === '1';
    }

    if (this.hasAttribute("hide-sao")) {
      this.hideSAO = this.getAttribute("hide-sao") === "true" || this.getAttribute("hide-sao") === '1';
    }

    if (this.hasAttribute("hide-pbr")) {
      this.hidePBR = this.getAttribute("hide-pbr") === "true" || this.getAttribute("hide-pbr") === '1';
    }

    if (this.hasAttribute("hide-color-texture")) {
      this.hideColorTexture = this.getAttribute("hide-color-texture") === "true" || this.getAttribute("hide-color-texture") === '1';
    }

    if (this.hasAttribute("hide-transparent-objects")) {
      this.hideTransparentObjects = this.getAttribute("hide-transparent-objects") === "true" || this.getAttribute("hide-transparent-objects") === '1';
    }

    if (this.hasAttribute("scale-canvas-resolution")) {
      this.scaleCanvasResolution = this.getAttribute("scale-canvas-resolution") === "true" || this.getAttribute("scale-canvas-resolution") === '1';
    }

    if (this.hasAttribute("scale-canvas-resolution-factor")) {
      this.scaleCanvasResolutionFactor = parseFloat(this.getAttribute("scale-canvas-resolution-factor")!);
    }

    if (this.hasAttribute("delay-before-restore")) {
      this.delayBeforeRestore = this.getAttribute("delay-before-restore") === "true" || this.getAttribute("delay-before-restore") === '1';
    }

    if (this.hasAttribute("delay-before-restore-seconds")) {
      this.delayBeforeRestoreSeconds = parseFloat(this.getAttribute("delay-before-restore-seconds")!);
    }

    new FastNavPlugin(viewer, {
      hideEdges: this.hideEdges,
      hideSAO: this.hideSAO,
      hidePBR: this.hidePBR,
      hideColorTexture: this.hideColorTexture,
      hideTransparentObjects: this.hideTransparentObjects,
      scaleCanvasResolution: this.scaleCanvasResolution,
      scaleCanvasResolutionFactor: this.scaleCanvasResolutionFactor,
      delayBeforeRestore: this.delayBeforeRestore,
      delayBeforeRestoreSeconds: this.delayBeforeRestoreSeconds,
    });
  }
}

export default XeoFastNav;
