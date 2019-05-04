import { Iris } from "./iris";

var game = new Iris("https://review.st-ignati.us/chemistry/story.json");
document.body.appendChild(game.element);


//Now let's tackle that stupid bottom bar on iOS Safari
function hideBottomBar() {
    window.scrollTo(0,0);
    window.scrollTo(0,1);
}
window.addEventListener("touchmove", hideBottomBar);
window.addEventListener("load", hideBottomBar);