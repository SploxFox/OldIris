import { Story } from "./story";
import { Cue } from "./cue";
import { Chapter } from "./chapter";
import { Episode } from "./episode";
import { Evidence } from "./evidence";
import { loadFile } from "../file-loader";
import { Localizer } from "../localizer";
import { Choice } from "./choice";

export class StoryManager {
    private story: Story;
    private episodePosition: number = 0;
    private chapterPosition: number = 0;
    private cuePosition: number = 0;
    private speechPosition: number = 0;
    private _evidence: Array<Evidence> = [];
    private storyLoadedCallback: Function;
    private _tangent: Array<Cue>;
    private tangentPosition: number;
    private evidenceIdRequired: string;

    //TODO: perhaps split up this class into smaller classes
    // so that the questions and things happen in their own
    // contained class?
    private acceptedResponses: Array<number>;
    private requestEvidence: Function;
    private requestChoices: (c: Array<Choice>, makeChoice: (c: number) => any) => any;
    private state: "title" | "tangent" | "story" | "frozen";
    constructor(path: string, storyLoadedCallback: Function, requestEvidence: Function, requestChoice: (c: Array<Choice>, makeChoice: (c: number) => any) => any) {
        loadFile.bind(this)("story/main-story.json", this.storyFinishedLoading, true);
        this.storyLoadedCallback = storyLoadedCallback;
        //console.log(request.responseText);
        
        //this.story = <Story>(JSON.parse('{ "episodes":[ { "title":"The Scientific Turnabout", "chapters":[ { "title":"Trial Lobby", "content":[ { "character":"$Rookie", "speech":[ "##mode(thought)(My name is $Rookie, and Im a defence attorney.)", "(More specifically, I am a scientific attorney--and today is my first case.)" ] } ] } ] }, { "title":"Turnabout for Futurity", "locked":true } ] }'));
        //console.log(this.story);
        this.requestEvidence = requestEvidence;
        this.requestChoices = requestChoice;
        this.state = "story";
    }
    storyFinishedLoading(request: XMLHttpRequest): void {
        //console.log(this);
        this.story = JSON.parse(request.responseText);
        this.storyLoadedCallback();
    }
    start() {
        this.register();
    }
    get canAdvance(): boolean {
        return (this.state == "story" || this.state == "tangent");
    }
    get speech(): string {
        var speech = this.cue.speech[this.speechPosition];
        //console.log(speech);
        return speech;
    }
    get cue(): Cue {
        if (this.state == "tangent") {
            return this.tangent[this.tangentPosition];
        } else {
            var cue = this.chapter.content[this.cuePosition];
            if (cue == undefined) {
                throw "Error: Found cue to be undefined!";
            }
            //console.log(cue);
            return cue;
         }
    }
    get chapter(): Chapter {
        return this.episode.chapters[this.chapterPosition]
    }
    get episode(): Episode {
        return this.story.episodes[this.episodePosition];
    }
    get evidence(): Array<Evidence> {
        return this._evidence;
    }
    register() {
        if (this.cue.evidence) {
            if (this.cue.evidence == "new") {
                this._evidence.push({
                    name: this.cue.name,
                    id: this.cue.id,
                    description: this.cue.description,
                    image: this.cue.image ? this.cue.image : undefined
                });
            }
        }
        
        if (this.cue.question) {
            this.state = "frozen";
            switch (this.cue.question.type) {
                case "evidence":
                    this.evidenceIdRequired = this.cue.question.id;
                    this.requestEvidence();
                    break;
                case "text":
                    //                                        Turns choices into their indexes                                            Filters out the -1's (wrong choices)
                    this.acceptedResponses = this.cue.question.choices.map((choice: Choice, index: number) => choice.correct ? index : -1).filter((index: number) => index != -1);
                    this.requestChoices(this.cue.question.choices, this.makeChoice.bind(this));
            }
        }
    }
    makeChoice(choice: number){
        //actually make the choice
        console.log("Made choice " + choice);
    }
    present(evidence: Evidence): boolean {
        if (evidence.id == this.evidenceIdRequired) {
            this.evidenceIdRequired = undefined;
            this.advance();
            return true;
        } else {
            this.tangent = this.cue.question.wrong;
            //console.log(this.tangent);
            //this.advance();
            this.evidenceIdRequired = undefined;
            return false;
        }
    }
    advance() {
        if (this.state == "frozen") {
            return;
        }
        /*if (this.tangent && this.tangent.length - 1 > this.tangentPosition) {
            if (this.tangentPosition == -1) {
                this.speechPosition = 0;
            }
            this.tangentPosition++;
            console.log("Advanced in tangent. Next speech is: " + this.cue.speech);
        }*/
        if (this.cue.speech && this.cue.speech.length - 1 > this.speechPosition) {
            this.speechPosition++;
            console.log("Advanced to next speech. New position: " + this.speechPosition);
        } else if (this.state == "tangent") {
            if (this.tangent.length - 1 > this.tangentPosition) {
                this.tangentPosition++;
            } else {
                this.tangent = undefined;
            }
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
    get tangent(): Array<Cue> {
        return this._tangent;
    }
    set tangent(value: Array<Cue>) {
        this._tangent = value;
        this.state = this.tangent == undefined ? "story" : "tangent";
        this.speechPosition = 0;
        this.tangentPosition = 0;
    }
    goToNextSpeech() {
        do {
            this.advance();
            this.register();
        } while (!this.cue.speech);
    }
}