import { resolvePath } from "../file-loader";

export class TabbedElement {
    tabElement: HTMLDivElement;
    bodyElement: HTMLDivElement;
    tabContentElement: HTMLDivElement;
    _state: "opened" | "closed";
    labelShown: boolean;
    tabTextElement: HTMLSpanElement;
    tabName: string;
    icon: HTMLImageElement;
    constructor (tabName: string, icon?: string) {
        this.tabName = tabName;
        this.labelShown = false;
        this.tabElement = document.createElement("div");
        this.tabElement.classList.add("tab","pop");

        this.tabContentElement = document.createElement("div");
        if (icon) {
            this.icon = document.createElement("img");
            this.icon.src = resolvePath(icon,false);
            this.icon.classList.add("icon");
            this.tabContentElement.appendChild(this.icon);
        }
        
        this.tabTextElement = document.createElement("span");
        this.tabTextElement.classList.add("tab-label");

        this.refreshLabel();

        this.tabContentElement.classList.add("tab-content");
        this.tabElement.appendChild(this.tabContentElement);

        this.bodyElement = document.createElement("div");
        this.bodyElement.classList.add("tab-body","pop","interactable");
        this.tabElement.appendChild(this.bodyElement);

        this.tabElement.addEventListener("interacted", function() {
            if (this.state == "opened") {
                this.close();
            } else {
                this.open();
            }
        }.bind(this));
        this.tabElement.classList.add("interactable");
        window.addEventListener("resize", this.refreshLabel.bind(this));
    }
    get state() {
        return this._state;
    }

    open(): void {
        this.tabElement.classList.add("opened");
        this._state = "opened";
    }
    close(): void {
        this.tabElement.classList.remove("opened");
        this._state = "closed";
    }
    refreshLabel(): void {
        if (((this.icon && window.innerWidth > 500) || !this.icon)) {
            if (!this.labelShown) {
                this.showLabel();
            }
        } else if (this.labelShown) {
            this.hideLabel();
        }
    }
    showLabel(): void {
        this.tabTextElement.textContent = ((window as any).localizer.localize(this.tabName));
        this.tabContentElement.appendChild(this.tabTextElement);
        //console.log("shown");
        this.labelShown = true;
    }
    hideLabel(): void {
        //console.log("hidden");
        this.tabTextElement.parentNode.removeChild(this.tabTextElement);
        this.labelShown = false;
    }
}