import { StoryManager } from "./story/story-manager";
import { Visuals } from "./visuals";
import { UserInterface } from "./user-interface";

export class Iris {
    storyManager: StoryManager;
    userInterface: UserInterface;
    visuals: Visuals;
    element: HTMLElement;
    touchStarted: boolean = false;
    constructor(path: string) {
        this.userInterface = new UserInterface();
        this.visuals = new Visuals();
        this.storyManager = new StoryManager(path);

        //temp code
        if (!this.storyManager.currentCue.speech) {
            this.storyManager.goToNextSpeech();
        }

        this.element = document.createElement("div");
        this.element.classList.add("game");
        var guiWrapper = document.createElement("div");
        guiWrapper.classList.add("interface-wrapper");
        guiWrapper.appendChild(this.userInterface.textBox.element);
        this.element.appendChild(guiWrapper);

        this.userInterface.textBox.showText(this.storyManager.currentCue.character, this.storyManager.currentSpeech);

        window.addEventListener("touchstart", function() {
            this.advance();
            this.touchStarted = true;
        }.bind(this));
        window.addEventListener("click", function() {
            if (this.touchStarted) {
                this.touchStarted = false;
            } else {
                this.advance();
            }
        }.bind(this));
    }
    advance(): void {
        this.storyManager.goToNextSpeech();
        this.userInterface.textBox.showText(this.storyManager.currentCue.character, this.storyManager.currentSpeech);
    }
}