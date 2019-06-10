import { TabbedElement } from "./tabbed-element";
import { StoryManager } from "../story/story-manager";
import { replaceElementChildren } from "./clear-element";
import { resolvePath } from "../file-loader";
import { Evidence } from "../story/evidence";
import { PopoutButton } from "./popout-button";
import { Localizer } from "../localizer";
import { uuidv4 } from "../guid";

export class OrganizerTab extends TabbedElement {
    evidenceContainerElement: HTMLElement;
    story: StoryManager;
    selectedEvidence: Evidence;
    presentButton: PopoutButton;
    _presenting: boolean;
    evidenceElements: Array<HTMLElement>;
    present: (e: Evidence) => void;
    constructor(story: StoryManager, present: (e: Evidence) => void) {
        super("organizer","icons/organizer.svg");
        this.present = present;
        this.presenting = false;
        this.story = story;
        this.bodyElement.classList.add("organizer");
        this.evidenceContainerElement = document.createElement("div");
        this.evidenceContainerElement.classList.add("evidence-container","pop");
        this.bodyElement.appendChild(this.evidenceContainerElement);

        this.presentButton = new PopoutButton("present");
        this.presentButton.element.classList.add("pop","tab-popout","tucked","interactable");
        this.tabElement.appendChild(this.presentButton.element);
        this.presentButton.element.addEventListener("interacted", function() {
            this.present(this.selectedEvidence)
            this.close(true);
        }.bind(this));

        this.evidenceElements = [];
    }
    get presenting(): boolean {
        return this._presenting;
    }
    set presenting(value: boolean) {
        this._presenting = value;
        if (this.presenting) {
            this.bodyElement.classList.add("presenting");
        } else {
            this.bodyElement.classList.remove("presenting");
        }
    }
    open(presenting: boolean = false) {
        console.log(this.evidenceElements.map(e => e.dataset.evidenceId));
        console.log(this.story.evidence.map(e => e.id));
        if (this.evidenceElements.map(e => e.dataset.evidenceId) != this.story.evidence.map(e => e.id)) {
            this.updateEvidenceElements();
        }
        super.open();
        if (presenting) {
            this.presentButton.element.classList.remove("tucked");
            this.presentButton.element.classList.add("disabled");
            this.presenting = true;
        }
    }
    close(force?: boolean) {
        if (force || !this.presenting){
            super.close();
            this.presentButton.element.classList.add("tucked");
            this.presenting = false;
        }
    }
    private getEvidenceElements(): Array<HTMLElement> {
        var elements: Array<HTMLElement> = [];
        for (var i = 0; i < this.story.evidence.length; i++) {
            var evidenceElement = document.createElement("div");
            evidenceElement.classList.add("evidence","pop");
            evidenceElement.dataset.evidenceId = this.story.evidence[i].id;

            var evidenceImage = document.createElement("img");
            evidenceImage.src = this.story.evidence[i].image ? resolvePath(this.story.evidence[i].image) : "https://www.staples-3p.com/s7/is/image/Staples/sp36188286_sc7?wid=512&hei=512";
            evidenceElement.appendChild(evidenceImage);

            var evidenceText = document.createElement("div");
            evidenceText.classList.add("evidence-text");
            evidenceElement.appendChild(evidenceText);

            var evidenceName = document.createElement("span");
            evidenceName.textContent = this.story.evidence[i].name;
            evidenceName.classList.add("evidence-name");
            evidenceText.appendChild(evidenceName);

            var evidenceDescription = document.createElement("span");
            evidenceDescription.textContent = this.story.evidence[i].description;
            evidenceDescription.classList.add("evidence-description");
            evidenceText.appendChild(evidenceDescription);

            evidenceElement.classList.add("interactable");
            evidenceElement.addEventListener("interacted", function(evidence: Evidence, e: Event){
                if (!evidenceElement.classList.contains("disabled") && this.presenting) {
                    this.select(e.target as HTMLElement);
                }
            }.bind(this,this.story.evidence[i]));

            elements.push(evidenceElement);
        }
        //console.log(elements);
        //this.evidenceElements = elements;
        return elements;
    }
    updateEvidenceElements() {
        this.evidenceElements = this.getEvidenceElements();
        replaceElementChildren(this.evidenceContainerElement, this.evidenceElements);
    }
    select(element: HTMLElement){
        if (this.selectedEvidence && this.selectedEvidence.id == element.dataset.evidenceId) {
            this.notReadyToPresent();
            return;
        }
        this.readyToPresent();
        element.classList.add("selected");
        this.selectedEvidence = this.story.evidence.find(e => e.id == element.dataset.evidenceId);
    }
    readyToPresent(){
        for (var i = 0; i < this.evidenceElements.length; i++) {
            this.evidenceElements[i].classList.remove("selected");
        }
        this.presentButton.element.classList.remove("disabled");
    }
    notReadyToPresent(){
        var selectedElement = (this.evidenceElements.find((element: HTMLElement) => (element.classList.contains("selected"))));
        this.selectedEvidence = undefined;
        this.presentButton.element.classList.add("disabled");
        selectedElement.classList.remove("selected");
    }
}