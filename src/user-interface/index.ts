import { TextBox } from "./text-box";
import { ChoiceSelect } from "./choice-select";
import { Choice } from "../story/choice";

export class UserInterface {
    textBox: TextBox;
    element: HTMLDivElement;
    constructor() {
        this.textBox = new TextBox();
        this.element = document.createElement("div");
        this.element.appendChild(this.textBox.element);
    }
    createChoices(choices: Array<Choice>, makeChoice: (c: number) => any): void {
        var choiceSelect = new ChoiceSelect(choices, makeChoice);
        this.element.appendChild(choiceSelect.container);
    }
}