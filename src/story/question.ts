import { Cue } from "./cue";
import { Choice } from "./choice";

export interface Question {
    type: "evidence" | "text";
    id?: string;
    wrong: Array<Cue>;

    //TODO: this

    //This may cause a circular dependency...
    choices?: Array<Choice>;
}