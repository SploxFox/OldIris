import { FormattedText, FormattedTextCommand, FormattedTextStop } from "./formatted-text";
import { FormattedTextComponent } from "./formatted-text-component";
import * as React from "react";


export interface TextVariables {
    timeBetweenCharacters: number;
}

export interface TextFunctions {
    [index: string]: (({}) => void);
    enter: (args: {
        character: string,
        space: "left" | "right" | "center"
    }) => void;
    exit: (args: {
        character: string
    }) => void;
    setSpeaker: (args: {
        newSpeaker: string
    }) => void;
}

export interface TextBoxProps {
    readonly formattedText: FormattedText;
    readonly textFunctions: TextFunctions;
    readonly allTextFinishedCallback: () => any;
    readonly textStoppedCallback: () => any;
    readonly textStartedCallback: () => any;
}

export interface TextBoxState {
    allText: FormattedText;
    renderedText: FormattedText;
    textVariables: TextVariables;
    stopped: boolean;
}

export class TextBox extends React.Component<TextBoxProps, TextBoxState> {
    private _speakingCharacter: string;
    private index: number;
    private startPos: number;
    constructor (props: TextBoxProps) {
        super(props);

        this.index = 0;
        this.startPos = 0;

        this.state = {
            allText: this.props.formattedText,
            renderedText: [this.props.formattedText[0]],
            textVariables: {
                timeBetweenCharacters: 10
            },
            stopped: true
        }
    }
    start() {
        this.startPos = this.index;
        setTimeout(this.addNextCharacter.bind(this), this.state.textVariables.timeBetweenCharacters);
        this.setState({
            stopped: false
        });
        this.props.textStartedCallback();
    }
    addNextCharacter() {
        this.index += 1;
        if (this.state.allText[this.index] instanceof FormattedTextCommand) {
            //console.log("woo!");
            this.props.textFunctions[(this.state.allText[this.index] as FormattedTextCommand).name]((this.state.allText[this.index] as FormattedTextCommand).args);
        }
        this.setState({
            renderedText: this.state.allText.slice(this.startPos, this.index)
        });
        console.log(this.state.renderedText);
        if (this.index < this.state.allText.length && !(this.state.allText[this.index] instanceof FormattedTextStop)) {
            setTimeout(this.addNextCharacter.bind(this), this.state.textVariables.timeBetweenCharacters);
        } else {
            this.setState({
                stopped: true
            });
            this.props.textStoppedCallback();
        }
        
    }
    render(){
        return (
            <div className="text-box">
                <FormattedTextComponent formattedText={this.state.renderedText}></FormattedTextComponent>
            </div>
        )
    }
}