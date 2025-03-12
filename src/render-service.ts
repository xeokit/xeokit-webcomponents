import { TreeViewNode } from "@xeokit/xeokit-sdk/types/plugins/TreeViewPlugin/TreeViewNode";

/**
 * @desc A {@link TreeViewPlugin} render class.
 * 
 */
export class RenderService {

  /*
  * Creates the root node of the tree.
  * @return {HTMLElement} The root node of the tree.
  */
  shadowRoot: ShadowRoot;

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
  }
  createRootNode(): HTMLElement {
    return document.createElement('ul');
  }

  /*
  * Creates node of the tree.
  * @param {TreeViewNode} node The node to create.
  * @param {EventListener} expandHandler The handler for expand event.
  * @param {EventListener} checkHandler The handler for check event.
  * @param {EventListener} contextmenuHandler The handler for context menu event.
  * @param {EventListener} titleClickHandler The handler for title click event.
  * @return {HTMLElement} The html element for the node.
  */
  createNodeElement(
    node: TreeViewNode,
    expandHandler: EventListener,
    checkHandler: EventListener,
    contextmenuHandler: EventListener,
    titleClickHandler: EventListener
  ): HTMLElement {
    const nodeElement = document.createElement('li');
    nodeElement.id = node.nodeId;

    if (node.xrayed) {
      nodeElement.classList.add('xrayed-node');
    }

    if (node.children.length > 0) {
      const switchElement = document.createElement('a');
      switchElement.href = '#';
      switchElement.id = `switch-${node.nodeId}`;
      switchElement.textContent = '+';
      switchElement.classList.add('plus');
      if (expandHandler) switchElement.addEventListener('click', expandHandler);
      nodeElement.appendChild(switchElement);
    }

    const checkbox = document.createElement('input');
    checkbox.id = `checkbox-${node.nodeId}`;
    checkbox.type = "checkbox";
    checkbox.checked = node.checked;
    checkbox.style.pointerEvents = "all";
    if (checkHandler) checkbox.addEventListener("change", checkHandler);
    nodeElement.appendChild(checkbox);

    const span = document.createElement('span');
    span.textContent = node.title;
    nodeElement.appendChild(span);

    if (titleClickHandler) {
      span.onclick = titleClickHandler;
    }

    return nodeElement;
  }

  createDisabledNodeElement(rootName: string): HTMLElement {
    const li = document.createElement('li');

    const switchElement = document.createElement('a');
    switchElement.href = '#';
    switchElement.textContent = '!';
    switchElement.classList.add('warn');
    switchElement.classList.add('warning');
    li.appendChild(switchElement);

    const span = document.createElement('span');
    span.textContent = rootName;
    li.appendChild(span);

    return li;
  }

  addChildren(element: HTMLElement, nodes: HTMLElement[]): void {
    const ul = document.createElement('ul');
    nodes.forEach((nodeElement) => {
      ul.appendChild(nodeElement);
    });

    if (!element.parentElement) return;

    element.parentElement.appendChild(ul);
  }

  expand(element: HTMLElement, expandHandler: EventListener, collapseHandler: EventListener): void {
    element.classList.remove('plus');
    element.classList.add('minus');
    element.textContent = '-';
    element.removeEventListener('click', expandHandler);
    element.addEventListener('click', collapseHandler);
  }

  collapse(element: HTMLElement, expandHandler: EventListener, collapseHandler: EventListener): void {
    if (!element) {
      return;
    }
    const parent = element.parentElement;
    if (!parent) {
      return;
    }
    const ul = parent.querySelector('ul');
    if (!ul) {
      return;
    }
    parent.removeChild(ul);
    element.classList.remove('minus');
    element.classList.add('plus');
    element.textContent = '+';
    element.removeEventListener('click', collapseHandler);
    element.addEventListener('click', expandHandler);
  }

  isExpanded(element: HTMLElement): boolean {
    const parentElement = element.parentElement;
    return parentElement ? parentElement.getElementsByTagName('li')[0] !== undefined : false;
  }

  getId(element: HTMLElement): string | undefined {
    const parentElement = element.parentElement;
    if (!parentElement) return undefined;
    return parentElement.id;
  }

  getIdFromCheckbox(element: HTMLInputElement): string {
    return element.id.replace('checkbox-', '');
  }

  getSwitchElement(nodeId: string): HTMLElement | null {
    return this.shadowRoot.getElementById(`switch-${nodeId}`);
  }

  isChecked(element: HTMLInputElement): boolean {
    return element.checked;
  }

  setCheckbox(nodeId: string, checked: boolean, indeterminate: boolean = false): void {
    const checkbox = document.getElementById(`checkbox-${nodeId}`) as HTMLInputElement;
    if (checkbox) {
      if (checked !== checkbox.checked) {
        checkbox.checked = checked;
      }
      if (indeterminate !== checkbox.indeterminate) {
        checkbox.indeterminate = indeterminate;
        if (indeterminate) {
          checkbox.checked = false;
        }
      }
    }
  }

  setXRayed(nodeId: string, xrayed: boolean): void {
    const treeNode = document.getElementById(nodeId);
    if (treeNode) {
      if (xrayed) {
        treeNode.classList.add('xrayed-node');
      } else {
        treeNode.classList.remove('xrayed-node');
      }
    }
  }

  setHighlighted(nodeId: string, highlighted: boolean): void {
    const treeNode = document.getElementById(nodeId);
    if (treeNode) {
      if (highlighted) {
        treeNode.scrollIntoView({ block: "center" });
        treeNode.classList.add('highlighted-node');
      } else {
        treeNode.classList.remove('highlighted-node');
      }
    }
  }
}
