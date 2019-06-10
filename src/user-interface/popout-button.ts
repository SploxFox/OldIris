import { Localizer } from "../localizer";

export class PopoutButton {
    element: HTMLElement;
    text: string;
    constructor(text: string) {
        this.text = text;
        this.element = document.createElement("button");
        this.element.textContent = ((window as any).localizer as Localizer).localize(text);
        this.element.classList.add("popout-button");
    }
}