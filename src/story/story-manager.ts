import { Story } from "./story";
import { Cue } from "./cue";
import { Chapter } from "./chapter";
import { Episode } from "./episode";
import { Evidence } from "./evidence";
import { loadFile } from "../file-loader";
import { Localizer } from "../localizer";

export class StoryManager {
    private story: Story;
    private currentEpisodePosition: number = 0;
    private currentChapterPosition: number = 0;
    private currentCuePosition: number = 0;
    private currentSpeechPosition: number = 0;
    private _currentEvidence: Array<Evidence> = [];
    private storyLoadedCallback: Function;
    constructor(path: string, storyLoadedCallback: Function) {
        loadFile.bind(this)("story/main-story.json", this.storyFinishedLoading, true);
        this.storyLoadedCallback = storyLoadedCallback;
        //console.log(request.responseText);
        
        //this.story = <Story>(JSON.parse('{ "episodes":[ { "title":"The Scientific Turnabout", "chapters":[ { "title":"Trial Lobby", "content":[ { "character":"$Rookie", "speech":[ "##mode(thought)(My name is $Rookie, and Im a defence attorney.)", "(More specifically, I am a scientific attorney--and today is my first case.)" ] } ] } ] }, { "title":"Turnabout for Futurity", "locked":true } ] }'));
        //console.log(this.story);
    }
    storyFinishedLoading(request: XMLHttpRequest): void {
        //console.log(this);
        this.story = JSON.parse(request.responseText);
        this.storyLoadedCallback();
    }
    get currentSpeech(): string {
        var speech = this.story.episodes[this.currentEpisodePosition].chapters[this.currentChapterPosition].content[this.currentCuePosition].speech[this.currentSpeechPosition];
        //console.log(speech);
        return speech;
    }
    get currentCue(): Cue {
        var cue = this.story.episodes[this.currentEpisodePosition].chapters[this.currentChapterPosition].content[this.currentCuePosition];
        if (cue == undefined) {
            throw "Error: Found cue to be undefined!";
        }
        //console.log(cue);
        return cue;
    }
    get currentChapter(): Chapter {
        return this.story.episodes[this.currentEpisodePosition].chapters[this.currentChapterPosition]
    }
    get currentEpisode(): Episode {
        return this.story.episodes[this.currentEpisodePosition];
    }
    get currentEvidence(): Array<Evidence> {
        return this._currentEvidence;
    }
    register() {
        if (this.currentCue.newevidence) {
            this._currentEvidence.push({
                name: this.currentCue.name,
                id: this.currentCue.newevidence,
                image: this.currentCue.image ? this.currentCue.image : "https://previews.123rf.com/images/iqoncept/iqoncept0901/iqoncept090100094/4221417-a-white-wrinkled-piece-of-paper-background-for-slides-brochures-and-presentations-.jpg"
            });
        }
    }
    advance() {
        if (this.currentCue.speech && this.currentCue.speech.length - 1 > this.currentSpeechPosition) {
            this.currentSpeechPosition++;
            console.log("Advanced to next speech. New position: " + this.currentSpeechPosition);

        } else if (this.currentChapter.content.length - 1 > this.currentCuePosition) {
            this.currentCuePosition++;
            this.currentSpeechPosition = 0;
            console.log("Advanced to next cue.");

        } else if (this.currentEpisode.chapters.length > this.currentChapterPosition) {
            this.currentChapterPosition++;
            this.currentSpeechPosition = 0;
            this.currentCuePosition = 0;
            console.log("Advanced to next chapter.");
        }
    }
    goToNextSpeech() {
        do {
            this.register();
            this.advance();
        } while (!this.currentCue.speech);
    }
}