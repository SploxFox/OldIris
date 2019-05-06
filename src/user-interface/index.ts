import { TextBox } from "./text-box";

export class UserInterface {
    textBox: TextBox;
    constructor() {
        this.textBox = new TextBox();
    }
}