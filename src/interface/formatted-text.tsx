import * as React from "react";
import { Game } from "..";

export class FormattedTextSet {
    name: string;
    value: string | number;
}
export class FormattedTextCommand {
    name: string;
    parameters: number[] | string[];
}
export class FormattedTextString extends String {
    
}
export class FormattedTextClassOpen extends String {
    
}
export class FormattedTextClassClose extends String {
    
}

export class FormattedText extends Array<FormattedTextSet | string | FormattedTextClassOpen | FormattedTextClassClose> {
    static parse(string: string): FormattedText {
        var formattedText: FormattedText = [];
        for (var i = 0; i < string.length; i++) {
            if (string[i] == "#" && string[i + 1] == "#") {
                string.substr(i + 2, string.substring(i).indexOf(";"))
                i = i + string.substring(i).indexOf(";");
            } else {
                formattedText.push(string[i]);
            }
        }
        return formattedText;
    }
}

interface FormattedTextProps {
    formattedText: FormattedText;
    textVariables?: FormattedTextVariables;
    
}

export interface FormattedTextState {
    renderedText: FormattedText;
    allText: FormattedText;
    blockIndex: number;
}

export interface FormattedTextVariables {
    [index: string]: number | string;
    timeBetweenCharacters?: number;
    
    //characterInBlockIndex: number;
}

export class FormattedTextComponent extends React.Component<FormattedTextProps,FormattedTextState> {
    public finished: boolean;
    public textVariables: FormattedTextVariables;
    public textClasses: string[];
    constructor(props: FormattedTextProps, public game: Game) {
        super(props);

        this.finished = false;
        this.state = {
            allText: this.props.formattedText,
            renderedText: this.props.formattedText,
            blockIndex: 0
        };
        this.textVariables = {
            timeBetweenCharacters: 100,
            blockIndex: 0,
            characterInBlockIndex: 0
        };
        this.textClasses = [];
    }
    render() {
        var characters = [];
        for (var i = 0; i < this.state.blockIndex; i++) {
            //characters.push(this.state.allText[i]);
            if (typeof this.state.allText[i] == "string") {
                characters.push(<FormattedTextCharacter character={this.state.allText[i] as string} classes={this.textClasses}></FormattedTextCharacter>);
            } else if (this.state.allText[i] instanceof FormattedTextSet) {
                this.textVariables[(this.state.allText[i] as FormattedTextSet).name] = (this.state.allText[i] as FormattedTextSet).value;
            } else if (this.state.allText[i] instanceof FormattedTextClassClose) {
                this.textClasses.splice(this.textClasses.indexOf(this.state.allText[i] as string));
            } else if (this.state.allText[i] instanceof FormattedTextClassOpen) {
                this.textClasses.push(this.state.allText[i] as string);
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
}

interface FormattedTextCharacterProps {
    character: string;
    classes: string[];
}

export class FormattedTextCharacter extends React.Component<FormattedTextCharacterProps,{}> {
    render() {
        return <span className={"formatted-text-character fade-in" + this.props.classes.join(" ")}>{this.props.character}</span>
    }
}