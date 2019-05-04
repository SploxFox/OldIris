import { Iris } from "./iris";

var game = new Iris("https://review.st-ignati.us/chemistry/story.json");
document.body.appendChild(game.element);


//Now let's tackle that stupid bottom bar on iOS Safari
window.addEventListener("touchmove", hideBottomBar);
function hideBottomBar() {
    window.scrollTo(0,1);
}
hideBottomBar();