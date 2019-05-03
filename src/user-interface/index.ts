import { TextBox } from "./text-box";
import { CourtRecord } from "./court-record";

export class UserInterface {
    textBox: TextBox;
    courtRecord: CourtRecord;
    constructor() {
        this.textBox = new TextBox();
        this.courtRecord = new CourtRecord();
    }
}