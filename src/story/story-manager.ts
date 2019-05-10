import { Story } from "./story";
import { Cue } from "./cue";
import { Chapter } from "./chapter";
import { Episode } from "./episode";
import { Evidence } from "./evidence";
import { loadFile } from "../file-loader";
import { Localizer } from "../localizer";

export class StoryManager {
    private story: Story;
    private episodePosition: number = 0;
    private chapterPosition: number = 0;
    private cuePosition: number = 0;
    private speechPosition: number = 0;
    private _evidence: Array<Evidence> = [];
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
    get speech(): string {
        var speech = this.story.episodes[this.episodePosition].chapters[this.chapterPosition].content[this.cuePosition].speech[this.speechPosition];
        //console.log(speech);
        return speech;
    }
    get cue(): Cue {
        var cue = this.story.episodes[this.episodePosition].chapters[this.chapterPosition].content[this.cuePosition];
        if (cue == undefined) {
            throw "Error: Found cue to be undefined!";
        }
        //console.log(cue);
        return cue;
    }
    get chapter(): Chapter {
        return this.story.episodes[this.episodePosition].chapters[this.chapterPosition]
    }
    get episode(): Episode {
        return this.story.episodes[this.episodePosition];
    }
    get evidence(): Array<Evidence> {
        return this._evidence;
    }
    register() {
        if (this.cue.evidence) {
            this._evidence.push({
                name: this.cue.name,
                id: this.cue.id,
                description: this.cue.description,
                image: this.cue.image ? this.cue.image : undefined
            });
        }
    }
    advance() {
        if (this.cue.speech && this.cue.speech.length - 1 > this.speechPosition) {
            this.speechPosition++;
            console.log("Advanced to next speech. New position: " + this.speechPosition);

        } else if (this.chapter.content.length - 1 > this.cuePosition) {
            this.cuePosition++;
            this.speechPosition = 0;
            console.log("Advanced to next cue.");

        } else if (this.episode.chapters.length > this.chapterPosition) {
            this.chapterPosition++;
            this.speechPosition = 0;
            this.cuePosition = 0;
            console.log("Advanced to next chapter.");
        }
    }
    goToNextSpeech() {
        do {
            this.register();
            this.advance();
        } while (!this.cue.speech);
    }
}