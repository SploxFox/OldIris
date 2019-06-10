import { Cue } from "./cue";

export interface Choice {
    text: string;
    after?: Array<Cue>;
    correct?: boolean;
    index?: number;
}