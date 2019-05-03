export class Visuals {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("visuals");
        this.context = this.canvas.getContext('2d');
        this.context.rect(10,10,20,20);
    }
}