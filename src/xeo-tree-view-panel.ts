import XeoViewerService from "./xeo-viewer-service";

class XeoTreeViewPanel extends HTMLElement {
    private width: string;
    private height: string;
    private bgColor: string;
    private positionLeft: boolean;
    private positionRight: boolean;

    constructor() {
        super();
        this.style.zIndex = "1000";
        this.width = "";
        this.height = "100%"
        this.bgColor = "rgba(255,255,255,0.6)";
    }

    async connectedCallback() {
        const viewerId = this.getViewerId(this);
        if (!viewerId) return;
        const viewer = XeoViewerService.getInstance().getViewer(viewerId);

        if (!viewer) return;

        const viewerElement = document.getElementById(viewerId);
        const viewerContainer = viewerElement!.shadowRoot!.querySelector('.xeokit-container');

        this.bgColor = this.getAttribute("bgColor") || this.bgColor;

        this.width = this.getAttribute("width") || this.width;
        this.height = this.getAttribute("height") || this.height;

        this.positionRight = this.hasAttribute("positionRight") || this.positionRight;
        this.positionLeft = !this.positionRight;

        this.bgColor = this.getAttribute("bgColor") || this.bgColor;


        const div = document.createElement("div");
        div.id = `${viewerId}-tree-panel`;

        viewerContainer!.appendChild(div);

        const tabSwitchContainer = document.createElement("div");
        tabSwitchContainer.className = "tabs";
        div.appendChild(tabSwitchContainer);

        const tabStyle = `
        width: 100%;
        display: flex;
        `
        const style = `
        position: absolute;
        padding: 10px;
        display: flex;
        flex-direction: column;
        top: 0px;
        right: ${this.positionLeft ? "" : "0px"};
        left: ${this.positionRight ? "" : "0px"};
        width: ${this.width};
        min-width: 250px;
        height: ${this.height};
        background-color: ${this.bgColor};
        direction: ${this.positionLeft ? "" : "ltr"}
        `;

        div.setAttribute('style', style);
        tabSwitchContainer.setAttribute('style', tabStyle);
    }

    private getViewerId(node: HTMLElement) {
        if (node.parentElement && node.parentElement.nodeName === "XEO-VIEWER") {
            return node.parentElement.id;
        } else {
            console.error("xeo-tree-view-panel must be nested directly inside xeo-viewer tag!")
            return null;
        }
    }
}

export default XeoTreeViewPanel;