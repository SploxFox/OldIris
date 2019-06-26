import * as React from "react";
import { Game } from "..";

export class FormattedTextSet {
    name: string;
    value: string | number;
}
export class FormattedTextCommand extends String {

}
export class FormattedTextString extends String {
    
}
export class FormattedTextClassOpen extends String {
    
}
export class FormattedTextClassClose extends String {
    
}

export class FormattedText extends Array<FormattedTextSet | string | FormattedTextClassOpen | FormattedTextClassClose> {

}

interface FormattedTextProps {
    formattedText: FormattedText;
    textVariables: FormattedTextVariables;
    
}

export interface FormattedTextVariables {
    timeBetweenCharacters: number;
    blockIndex: number;
    characterInBlockIndex: number;
}

export class FormattedTextComponent extends React.Component<FormattedTextProps,FormattedTextVariables> {
    public finished: boolean;
    constructor(props: FormattedTextProps, public game: Game) {
        super(props);

        this.finished = false;
        this.state = this.props.textVariables;
    }
    render() {
        var finishedBlocks: FormattedText[] = [];
        for (var i = 0; i < this.state.blockIndex; i++) {
            
        }
        return(
            <span>{
                
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
        return <span className={"formatted-text-character " + this.props.classes.join(" ")}>{this.props.character}</span>
    }
}