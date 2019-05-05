export class CourtRecord {
    element: HTMLDivElement;
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("court-record","text","pop");
    }
}