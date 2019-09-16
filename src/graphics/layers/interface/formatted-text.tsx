import * as React from "react";

export class FormattedTextSet {
    name: string;
    value: string | number;
}
export class FormattedTextCommand {
    constructor(public name: string, public args: {[index: string]: number | string}) {

    }
}
export class FormattedTextStop {
    constructor(){

    }
}
export class FormattedTextString {
    constructor(public string: string, public classes: string[] = []) {

    }
}
export class FormattedTextClassOpen extends String {
    
}
export class FormattedTextClassClose extends String {
    
}

export class FormattedText extends Array<FormattedTextSet | FormattedTextClassOpen | FormattedTextClassClose | FormattedTextCommand | FormattedTextStop | FormattedTextString> {
    static parse(string: string): FormattedText {
        let formattedText: FormattedText = new FormattedText();
        console.log(formattedText);
        let currentClasses: string[] = [];
        for (let i = 0; i < string.length; i++) {
            if (string[i] == "/" && string[i + 1] == "/") {
                i = i + string.substring(i).indexOf(";");
            } else if (string[i] == "$" && string[i + 1] == "$") {
                const command = string.substr(i + 2, string.substring(i).replace(/\\\;/g, "  ").indexOf(";") - 3).split("(");
                console.log(command);
                const commandArgs = JSON.parse(command[1]);

                //const stringWithoutFakeSemicolons = string;
                i = i + string.substring(i).replace(/\\\;/g, "  ").indexOf(";");
                //console.log(commandString);
                formattedText.push(new FormattedTextCommand(
                    command[0],
                    commandArgs as {[index: string]: number | string}
                ));
            } else if (string[i] == ">" && string[i + 1] == ">") {
                const newSpeaker = string.substr(i + 2, string.substring(i).indexOf(";") - 2);
                //const commandArgs = JSON.parse(command[1]);
                i = i + string.substring(i).indexOf(";");
                //console.log(commandString);
                formattedText.push(new FormattedTextCommand(
                    "setSpeaker",
                    {
                        newSpeaker: newSpeaker
                    }
                ));
            } else if (string[i] == "#") {
                formattedText.push(new FormattedTextStop());
            } else if (string[i] == "<") {
                let styleClass = "";
                if (string[i + 1] == "/") {
                    styleClass = string.substr(i + 2, string.substring(i + 2).indexOf(">"));
                } else {
                    styleClass = string.substr(i + 1, string.substring(i + 1).indexOf(">"));
                }

                if (string[i + 1] == "/") {
                    currentClasses.splice(currentClasses.indexOf(styleClass), 1);
                    
                } else {
                    currentClasses.push(styleClass);
                }

                i = i + string.substring(i).indexOf(">");
            } else {
                formattedText.push(new FormattedTextString(string[i].replace("\n",""), currentClasses.slice()));
            }
        }
        console.log(formattedText)
        return formattedText;
    }
}

interface FormattedTextProps {
    formattedText: FormattedText;
    textVariables?: FormattedTextVariables;
    
}

export interface FormattedTextState {
    text: FormattedText;
}

export interface FormattedTextVariables {
    [index: string]: number | string;
    timeBetweenCharacters?: number;
    
    //characterInBlockIndex: number;
}

/*export class FormattedTextComponent extends React.Component<FormattedTextProps,FormattedTextState> {
    public finished: boolean;
    //public textVariables: FormattedTextVariables;
    public textClasses: string[];
    constructor(props: FormattedTextProps, public game: Game) {
        super(props);

        //this.finished = false;
        this.state = {
            text: this.props.formattedText,
            //renderedText: this.props.formattedText,
            //blockIndex: 0
        };
        /*this.textVariables = {
            timeBetweenCharacters: 100,
            blockIndex: 0,
            characterInBlockIndex: 0
        };
        this.textClasses = [];
    }
    render() {
        let characters = [];
        for (let i = 0; i < this.state.text.length; i++) {
            //characters.push(this.state.allText[i]);
            if (typeof this.state.text[i] == "string") {
                characters.push(<FormattedTextCharacter character={this.state.text[i] as string} classes={this.textClasses}></FormattedTextCharacter>);
            } else if (this.state.text[i] instanceof FormattedTextSet) {
                //this.textVariables[(this.state.text[i] as FormattedTextSet).name] = (this.state.text[i] as FormattedTextSet).value;
            } else if (this.state.text[i] instanceof FormattedTextClassClose) {
                this.textClasses.splice(this.textClasses.indexOf(this.state.text[i] as string));
            } else if (this.state.text[i] instanceof FormattedTextClassOpen) {
                this.textClasses.push(this.state.text[i] as string);
            }
        }
        if (this.state.blockIndex < this.state.allText.length) {
            window.setTimeout(() => {
                this.setState({blockIndex: this.state.blockIndex + 1});
            }, this.textVariables.timeBetweenCharacters)
        }
        return(
            <span>{
                characters
            }</span>
        )
    }
}*/

interface FormattedTextCharacterProps {
    character: string;
    classes: string[];
    invisible?: boolean;
}

interface FormattedTextCharacterState {
    invisible: boolean;
}

export class FormattedTextCharacter extends React.Component<FormattedTextCharacterProps,FormattedTextCharacterState> {
    constructor(props: FormattedTextCharacterProps) {
        super(props);

        this.state = {
            invisible: this.props.invisible
        }
    }
    render() {
        return <span className="formatted-text-character-container" style={{position: "relative"}}>
            <span style={{visibility: "hidden"}}>{this.props.character}</span>
            <span style={{
            visibility: this.state.invisible ? "hidden" : "visible",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "block"
        }} className={(this.state.invisible ? "invisible" : "") + " formatted-text-character " + this.props.classes.join(" ") + (this.props.character == " " ? "" : " non-space-character")}>{this.props.character}</span></span>
    }
}