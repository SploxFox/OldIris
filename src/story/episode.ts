import { Chapter } from "./chapter";

export interface Episode {
    title: string;
    chapters?: Array<Chapter>;
    locked?: boolean;
}