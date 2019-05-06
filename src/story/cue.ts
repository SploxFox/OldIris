export interface Cue {
    character?: string;
    speech?: Array<string>;
    backdrop?: string;
    music?: string;
    sequence?: string;
    autotransition?: boolean;
    focus?: string;
    transition?: string;
    evidence?: "new" | "update" | "discard";
    id?: string;
    name?: string;
    description?: string;
    notification?: boolean;
    image?: string;
}