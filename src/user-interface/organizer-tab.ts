import { TabbedElement } from "./tabbed-element";
import { StoryManager } from "../story/story-manager";
import { replaceElementChildren } from "./clear-element";
import { resolvePath } from "../file-loader";
import { Evidence } from "../story/evidence";

export class OrganizerTab extends TabbedElement {
    evidenceContainerElement: HTMLElement;
    story: StoryManager;
    selectedEvidence: Evidence;
    constructor(story: StoryManager) {
        super("organizer","icons/organizer.svg");
        this.story = story;
        this.bodyElement.classList.add("organizer");
        this.evidenceContainerElement = document.createElement("div");
        this.evidenceContainerElement.classList.add("evidence-container","pop");
        this.bodyElement.appendChild(this.evidenceContainerElement);
    }
    open() {
        replaceElementChildren(this.evidenceContainerElement, this.getEvidenceElements())
        super.open();
    }
    getEvidenceElements(): Array<HTMLElement> {
        var elements: Array<HTMLElement> = [];
        for (var i = 0; i < this.story.evidence.length; i++) {
            var evidenceElement = document.createElement("div");
            evidenceElement.classList.add("evidence","pop");

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
                for (var i = 0; i < elements.length; i++) {
                    elements[i].classList.remove("selected");
                    (e.target as HTMLElement).classList.add("selected");
                }
                this.selectedEvidence = evidence;
                console.log(evidence);
            }.bind(this,this.story.evidence[i]));

            elements.push(evidenceElement);
        }
        console.log(elements);
        return elements;
    }
}