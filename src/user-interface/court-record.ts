export class CourtRecord {
    _state: "opened" | "closed";
    element: HTMLDivElement;
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("court-record","text");
    }
}