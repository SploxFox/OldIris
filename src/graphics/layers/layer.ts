export class Layer {
    update(): void {}
    readonly element: HTMLDivElement;
    constructor() {
        this.element = document.createElement("div");
        this.element.style.top = "0px";
        this.element.style.bottom = "0px";
        this.element.style.right = "0px";
        this.element.style.left = "0px";
        this.element.style.position = "absolute";
    }
}