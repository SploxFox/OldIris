export function replaceElementChildren(element: HTMLElement, newChildren: Array<HTMLElement>): HTMLElement {
    while (element.firstElementChild) { element.firstElementChild.remove(); }
     for (var i = 0; i < newChildren.length; i++) {
        element.appendChild(newChildren[i]);
    }
    return element;
}