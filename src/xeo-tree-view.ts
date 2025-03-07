import { TreeViewPlugin } from "@xeokit/xeokit-sdk";
import XeoViewerService from "./xeo-viewer-service";
import { RenderService } from "./render-service";

type HierarchyType =  "containment" | "storeys" | "types";
let trees : {viewerId: string, instance: XeoTreeView}[] = [];
let tabs: {viewerId: string, button: HTMLButtonElement, contentContainer: HTMLElement}[] = [];

export default class XeoTreeView extends HTMLElement {
    private hierarchy: HierarchyType;
    private autoExpandDepth: number;
    private sortNodes: boolean;

    constructor() {
        super();
        this.autoExpandDepth = 0;
        this.sortNodes = true;
    }

    async connectedCallback() {

        this.autoExpandDepth = Number(this.getAttribute("autoExpandDepth")) || this.autoExpandDepth;

        this.sortNodes = Boolean(this.getAttribute("sortNodes")) || this.sortNodes;

        this.hierarchy = this.getAttribute("hierarchy") as HierarchyType || "containment";

        const viewerId = this.getViewerId(this);

        if (!viewerId) return;

        trees.push({viewerId: viewerId, instance: this});
        const viewer = XeoViewerService.getInstance().getViewer(viewerId);

        if (!viewer) return;


        const viewerTrees = trees.filter((tree) => {
            return tree.viewerId === viewerId;
        });
        for (const tree of viewerTrees) {
            if (tree.instance === this) continue;
            if (tree.instance.hierarchy === this.hierarchy) {
                console.error("only one tree-view with specific hierarchy can be nested inside xeo-tree-view-panel!");
                return;
            }
        }
        const viewerElement = document.getElementById(viewerId);

        const viewerContainer = viewerElement!.shadowRoot!.querySelector('.xeokit-container');

        if (!viewerContainer) {
            console.error('all xeo-elements must be nested inside xeo-viewer tag');
            return;
        }
        
        const panelContainer = viewerElement!.shadowRoot!.getElementById(`${viewerId}-tree-panel`);

        if (!panelContainer) {
            console.error('xeo-tree-view must be nested inside xeo-tree-view-panel tag!');
            return;
        }

        viewerContainer.appendChild(panelContainer);

        const tabButtonsContainer = viewerContainer.querySelector(".tabs");
        if (!tabButtonsContainer) return;

        const tabButton = document.createElement("button");
        const tabText = document.createElement("span");
        tabButton.append(tabText);
        
        tabButtonsContainer.append(tabButton);

        const div = document.createElement("div");

        tabs.push({viewerId: viewerId, button: tabButton, contentContainer: div});

        panelContainer!.appendChild(div);

        const containerStyle = `
        white-space: wrap;
        font-size: 1rem;
        overflow-y: scroll;
        overflow-x: hidden;
        overflow-wrap: break-word;
        flex-grow: 1;
        `;

        const buttonStyle = `
        font-family: inherit;
        font-size: inherit;
        cursor: pointer;
        padding: 5px 0px 5px 0px;
        background: none;
        border: none;
        border-radius: 0px;
        flex-grow: 1;
        `;

        div.setAttribute('style', containerStyle);
        tabButton.setAttribute('style', buttonStyle);

        if (this.hierarchy === "containment") {
            tabText.innerText = "Objects";
        } else if (this.hierarchy === "types") {
            tabText.innerText = "Classes";
        } else {
            tabText.innerText = "Storeys";
        };

        this.updateTrees(viewerId);

        new TreeViewPlugin(viewer, {
            containerElement: div, 
            hierarchy: this.hierarchy as HierarchyType, 
            autoExpandDepth: this.autoExpandDepth, 
            sortNodes: this.sortNodes,
            renderService: new RenderService(viewerElement!.shadowRoot!)
        });

        tabButton.addEventListener("mouseover", () => {
            if (tabButton.classList.contains("active")) {
                return;
            };
            tabButton.style.fontWeight = "600";
        });

        tabButton.addEventListener("mouseout", () => {
            if (tabButton.classList.contains("active")) {
                return;
            };

            tabButton.style.fontWeight = "400";
        });

        tabButton.addEventListener("click", () => {
            for (const tab of tabs) {
                if (tab.viewerId !== viewerId) continue;
                if (tab.button === tabButton) {
                    tab.button.classList.add("active");
                    tab.contentContainer.style.display = "block";
                    tab.button.style.fontWeight = "600";
                    tab.button.style.borderBottom = "2px solid black"
                } else {
                    tab.button.classList.remove("active");
                    tab.contentContainer.style.display = "none";    
                    tab.button.style.fontWeight = "400";   
                    tab.button.style.borderBottom = "none"           
                }
            }
        });
    }

    private getViewerId(node: HTMLElement, depth = 0) {
        if (depth > 2) {
            console.error("wrong hierarchy of xeo-elements!");
            return null;
        };
        
        if (node.parentElement) {
            if (node.parentElement.nodeName !== "XEO-VIEWER") {
                return this.getViewerId(node.parentElement, depth + 1);
            } else {
                return node.parentElement.id;
            }
        } else {
            console.error("xeo-tree-view must be nested inside xeo-viewer tag!")
            return null;
        }
    }

    private updateTrees(viewerId: string) {
        const viewerTrees = trees.filter((tree) => {
            return tree.viewerId === viewerId;
        });
        const viewerTabs = tabs.filter((tab) => {
            return tab.viewerId === viewerId;
        });7

        for (const element of viewerTabs) {
            element.contentContainer.style.display = "none";
            element.button.classList.remove("active");     
            if (viewerTrees.length === 1) {
                element.button.style.display = "none";
            } else {
                element.button.style.display = "inline";
                element.button.style.borderBottom = "none"
            }
        }
        viewerTabs[0].contentContainer.style.display = "block";
        viewerTabs[0].button.style.fontWeight = "600";
        viewerTabs[0].button.classList.add("active");
        viewerTabs[0].button.style.borderBottom = "2px solid black"
    }
};