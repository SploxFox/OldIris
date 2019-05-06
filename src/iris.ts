import { StoryManager } from "./story/story-manager";
import { Visuals } from "./visuals";
import { UserInterface } from "./user-interface";
import { Localizer } from "./localizer";

export class Iris {
    storyManager: StoryManager;
    userInterface: UserInterface;
    visuals: Visuals;
    element: HTMLElement;
    touchStarted: boolean = false;
    guiWrapper: HTMLElement;
    finishedLoading: boolean;
    interfaceHasLoaded: boolean;
    storyHasLoaded: boolean;
    constructor() {
        this.finishedLoading = false;
        this.interfaceHasLoaded = false;
        this.storyHasLoaded = false;

        this.visuals = new Visuals();

        this.element = document.createElement("div");
        this.element.classList.add("game");
        this.guiWrapper = document.createElement("div");
        this.guiWrapper.classList.add("interface-wrapper");
        this.element.appendChild(this.guiWrapper);

        window.addEventListener("touchstart", function(event: TouchEvent) {
            event.touches[0].target.dispatchEvent(new CustomEvent("interacted",{}));
            if (!(event.target as HTMLElement).classList.contains("interactable")) {
                this.advance();
            }
            this.touchStarted = true;
        }.bind(this));
        window.addEventListener("click", function(event: Event) {
            if (this.touchStarted) {
                this.touchStarted = false;
                return;
            }
            event.target.dispatchEvent(new CustomEvent("interacted",{}));
            if (!(event.target as HTMLElement).classList.contains("interactable")) {
                console.log(this.userInterface.textBox);
                if (!this.userInterface.textBox.tabsOpen) {
                    this.advance();
                }
            }
            
        }.bind(this));
    }
    loadStory(path: string) {
        this.storyManager = new StoryManager(path,this.storyLoaded.bind(this));
    }
    localizationLoaded(type: string): void {
        console.log(this);
        this.userInterface = new UserInterface();
        this.interfaceHasLoaded = true;
        this.guiWrapper.appendChild(this.userInterface.textBox.element);
        this.checkLoadStatus();
    }
    storyLoaded(): void {
        this.storyHasLoaded = true;
        this.checkLoadStatus();
    }
    checkLoadStatus(): void {
        //this is probably just temporary
        if (this.interfaceHasLoaded && this.storyHasLoaded) {
            this.finishedLoading = true;
            this.start();
        }
    }
    start(): void {
        //temp code
        if (!this.storyManager.currentCue.speech) {
            this.storyManager.goToNextSpeech();
        }
        this.userInterface.textBox.showText(this.storyManager.currentCue.character, this.storyManager.currentSpeech);
    }
    advance(): void {
        if (this.userInterface.textBox.isFinished) {
            this.storyManager.goToNextSpeech();
            this.userInterface.textBox.showText(this.storyManager.currentCue.character, this.storyManager.currentSpeech);
        } else {
            this.userInterface.textBox.finish();
        }
    }
    showScrollNotification(): void {
        var scrollNoti = document.createElement("div");
        this.guiWrapper.appendChild(scrollNoti);

        scrollNoti.textContent = "Scroll Down";
        scrollNoti.classList.add("scroll-noti","pop","text");
        scrollNoti.style.top = "10px";
        window.setTimeout(function() {
            scrollNoti.style.top = "-100vh";
        },5000)
    }
}