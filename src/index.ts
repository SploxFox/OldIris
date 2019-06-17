import { Iris } from "./iris";
import { TabbedElement } from "./user-interface/tabbed-element";
import { Localizer } from "./localizer";
import { OrganizerTab } from "./user-interface/organizer-tab";


var game = new Iris();
export var localizer = new Localizer("english", locLoaded);
game.loadStory("main-story.json");

document.body.appendChild(game.element);

if (/iP(((a|o)d)|hone)/i.test(navigator.userAgent)){
    document.body.classList.add("mobile");
    document.body.parentElement.classList.add("mobile");
    game.isMobile = true;
    game.showScrollNotification();
}

function locLoaded() {
    game.localizationLoaded.bind(game)();
    game.userInterface.textBox.tabs = [
        new TabbedElement("save", "icons/save.svg"),
        new TabbedElement("chat-history", "icons/chat.svg"),
        new OrganizerTab(game.storyManager, game.present.bind(game))
    ]
    game.userInterface.textBox.updateTabs();
}

//window.addEventListener("touchmove", hideBottomBar);
//window.addEventListener("load", hideBottomBar);