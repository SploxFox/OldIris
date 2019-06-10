import { Choice } from "../story/choice";

export class ChoiceSelect {
    private choices: Array<Choice>;
    container: HTMLDivElement;
    element: HTMLDivElement;
    constructor (choices: Array<Choice>, makeChoice: (c: number) => any) {
        this.choices = choices;

        this.container = document.createElement("div");
        this.container.classList.add("choices-container");

        this.element = document.createElement("div");
        this.element.classList.add("cover");
        if (window.innerHeight - this.container.offsetHeight < 500) {
            this.element.classList.add("cover");
        }
        for (var i = 0; i < this.choices.length; i++) {
            var choiceElement = document.createElement("div");
            choiceElement.classList.add("pop","choice");
            window.addEventListener("interacted",function(choiceToMake: Choice) {
                makeChoice(choiceToMake.index);
            }.bind(this,choices[i]));

            var choiceText = document.createElement("span");
            choiceText.classList.add("text","choice-text","silent-child");
            choiceText.textContent = choices[i].text;
            choiceElement.appendChild(choiceText);
            this.container.appendChild(choiceElement);
        }
        this.element.appendChild(this.container);
    }
    clear() {
        this.container.parentElement.removeChild(this.container);
        this.element.parentElement.removeChild(this.element);
    }
}