import { StoryManager } from "./story/story-manager";
import { Visuals } from "./visuals";
import { UserInterface } from "./user-interface";
import { Localizer } from "./localizer";
import { OrganizerTab } from "./user-interface/organizer-tab";
import { TabbedElement } from "./user-interface/tabbed-element";
import { Evidence } from "./story/evidence";
import { Choice } from "./story/choice";

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
    storySkipping: number;
    constructor() {
        this.finishedLoading = false;
        this.interfaceHasLoaded = false;
        this.storyHasLoaded = false;

        //Get the scrollbar width 
        var scrollBarTestDiv = document.createElement("div");
        scrollBarTestDiv.style.overflow = "scroll";
        scrollBarTestDiv.textContent = "Test Div";
        document.body.appendChild(scrollBarTestDiv);
        var scrollWidth = scrollBarTestDiv.offsetWidth - scrollBarTestDiv.clientWidth;
        document.documentElement.style.setProperty("--scrollBarWidth",scrollWidth.toString() + "px");
        document.body.removeChild(scrollBarTestDiv);

        this.visuals = new Visuals();

        this.element = document.createElement("div");
        this.element.classList.add("game");
        this.guiWrapper = document.createElement("div");
        this.guiWrapper.classList.add("interface-wrapper");
        this.element.appendChild(this.guiWrapper);

        window.addEventListener("touchstart", function(event: TouchEvent) {
            event.touches[0].target.dispatchEvent(new CustomEvent("interacted",{}));
            this.attemptToAdvance();
            this.touchStarted = true;
        }.bind(this));
        window.addEventListener("click", function(event: Event) {
            if (this.touchStarted) {
                this.touchStarted = false;
                return;
            }
            event.target.dispatchEvent(new CustomEvent("interacted",{}));
            this.attemptToAdvance(event.target);
        }.bind(this));
        window.addEventListener("mousedown", function(event: Event){
            if (this.touchStarted) {
                return;
            }
            this.scheduleStorySkip();
        }.bind(this))
        window.addEventListener("mouseup", function(event: Event) {
            if (this.touchStarted) {
                return;
            }
            this.stopSkippingStory();
        }.bind(this));
    }
    attemptToAdvance(element?: HTMLElement) {
        if (!this.userInterface.textBox.tabsOpen && this.storyManager.canAdvance) {
            if (element) {
                var elementIsInteractable = (element.classList.contains("interactable"));
                //console.log(elementIsInteractable);
                if (!elementIsInteractable) {
                    this.advance();
                }
            } else {
                this.advance();
            }
        }
        
    }
    scheduleStorySkip() {
        //window.clearTimeout(this.storySkipping);
        this.storySkipping = window.setTimeout(this.startSkippingStory.bind(this), 500);
    }
    startSkippingStory() {
        this.storySkipping = window.setInterval(this.attemptToAdvance.bind(this),100);
    }
    stopSkippingStory() {
        window.clearTimeout(this.storySkipping);
        window.clearInterval(this.storySkipping);
    }
    loadStory(path: string) {
        this.storyManager = new StoryManager(path,this.storyLoaded.bind(this),this.requestEvidence.bind(this),this.requestChoices.bind(this));
    }
    requestEvidence() {
        (this.userInterface.textBox.tabs.find((tab: TabbedElement) => (tab instanceof OrganizerTab)) as OrganizerTab).open(true);
    }
    requestChoices(choices: Array<Choice>, makeChoice: (c: number) => any) {
        this.userInterface.createChoices(choices, makeChoice);
    }
    localizationLoaded(type: string): void {
        console.log(this);
        this.userInterface = new UserInterface();
        this.interfaceHasLoaded = true;
        this.guiWrapper.appendChild(this.userInterface.element);
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
        this.storyManager.start();
        if (!this.storyManager.cue.speech) {
            this.storyManager.goToNextSpeech();
        }
        this.userInterface.textBox.showText(this.storyManager.cue.character, this.storyManager.speech);
    }
    advance(): void {
        if (this.userInterface.textBox.isFinished) {
            this.storyManager.goToNextSpeech();
            this.userInterface.textBox.showText(this.storyManager.cue.character, this.storyManager.speech);
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
    present(evidence: Evidence){
        this.storyManager.present(evidence);
        this.userInterface.textBox.showText(this.storyManager.cue.character, this.storyManager.speech);
    }
}