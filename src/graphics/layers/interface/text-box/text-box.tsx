import { FormattedText, FormattedTextCommand, FormattedTextStop, FormattedTextCharacter, FormattedTextString, FormattedTextSet, FormattedTextClassClose, FormattedTextClassOpen } from "../formatted-text";
import { FormattedTextComponent } from "../formatted-text-component";
import * as React from "react";


export interface TextVariables {
    timeBetweenCharacters: number;
}

export interface TextFunctions {
    [index: string]: (({}) => void);
    enter?: (args: {
        character: string,
        space: "left" | "right" | "center"
    }) => void;
    exit?: (args: {
        character: string
    }) => void;
    setSpeaker?: (args: {
        newSpeaker: string
    }) => void;
    jump?: (args:{
        destination: string
    }) => void;
    branchChoices?: (args:{
        choices: {
            text: string,
            destination: string
        }[]
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
    //currentText: FormattedText;
    textVariables: TextVariables;
    stopped: boolean;
    startPos: number;
    endPos: number;
    characterRefs: FormattedTextCharacter[];
    characterComponents: any[];
    canContinue: boolean;
}

export class TextBox extends React.Component<TextBoxProps, TextBoxState> {
    private _speakingCharacter: string;
    private index: number;
    //private startPos: number;
    constructor (props: TextBoxProps) {
        super(props);

        this.index = 0;

        const characterData = getFormattedCharacters(this.props.formattedText);

        this.state = {
            allText: this.props.formattedText,
            //currentText: [this.props.formattedText[0]],
            textVariables: {
                timeBetweenCharacters: 15
            },
            stopped: true,
            startPos: 0,
            endPos: TextBox.getNextEndPos(0, this.props.formattedText),
            characterRefs: characterData.refs,
            characterComponents: characterData.characters,
            canContinue: true
        };

        console.log("Constructor called!");
    }
    componentDidMount(){
        this.start();
    }
    static getNextEndPos(startPos: number, text: FormattedText) {
        for (let i = startPos; i < text.length; i++) {
            if (text[i] instanceof FormattedTextStop) {
                return i;
            }
        }
        return text.length;
    }
    start() {
        if (!this.state.canContinue) {
            return;
        }
        //this.index = 0;
        this.setState({
            startPos: this.index,
            endPos: TextBox.getNextEndPos(this.index + 1, this.state.allText),
            stopped: false,
            allText: this.props.formattedText
        });
        //this.forceUpdate();
        //this.index += 1;
        setTimeout(this.addNextCharacter.bind(this), this.state.textVariables.timeBetweenCharacters);
        this.props.textStartedCallback();

        /*this.setState({
            currentText: this.state.allText.slice(this.state.startPos, this.state.endPos),
        });*/
    }
    addNextCharacter() {
        if (this.state.allText[this.index] instanceof FormattedTextCommand) {
            //console.log("woo!");
            this.props.textFunctions[(this.state.allText[this.index] as FormattedTextCommand).name]((this.state.allText[this.index] as FormattedTextCommand).args);
        }

        try {
            this.state.characterRefs[this.index].setState({invisible: false});
        } catch(e) {
            //I'm done
        }
        
        //this.state.allText[this.index] instanceof FormattedTextCharacter && (this.state.allText[this.index] as FormattedTextCharacter).setState({visible: true});
        
        //console.log(this.state.renderedText);
        //if (this.index < this.state.allText.length && !(this.state.allText[this.index] instanceof FormattedTextStop)) {

        this.index += 1;

        if (this.index < this.state.endPos) {
            setTimeout(this.addNextCharacter.bind(this), this.state.textVariables.timeBetweenCharacters);
        } else {
            this.setState({
                stopped: true
            });
            //this.index += 1; //Skipping over the stop marker
            this.props.textStoppedCallback();
        }
        
    }
    render(){
        //<FormattedTextComponent formattedText={this.state.allText}></FormattedTextComponent>
        //let charData = getFormattedCharacters(this.state.allText);

        //this.setState({characterRefs: charData.refs});

        //console.log("rendered!");
        //console.log(this.state);
        return (
            <div className="text-box">
                <span className="formatted-text">
                    {this.state.characterComponents.slice(this.state.startPos, this.state.endPos)}
                </span>
            </div>
        )
    }
}

function getFormattedCharacters(formattedText: FormattedText) {
    let characters = [];
    let characterRefs: FormattedTextCharacter[] = [];
    let textClasses = [];
    for (let i = 0; i < formattedText.length; i++) {
        //characters.push(this.state.allText[i]);
        if (typeof formattedText[i] == "string") {
            characters[i] = (<FormattedTextCharacter invisible={true} character={formattedText[i] as string} classes={textClasses} ref={(ft) => characterRefs[i] = ft} key={i}></FormattedTextCharacter>);
        } else if (formattedText[i] instanceof FormattedTextString) {
            characters[i] = (<FormattedTextCharacter invisible={true} character={(formattedText[i] as FormattedTextString).string} classes={(formattedText[i] as FormattedTextString).classes} ref={(ft) => characterRefs[i] = ft} key={i}></FormattedTextCharacter>)
        }else if (formattedText[i] instanceof FormattedTextSet) {
            //this.textVariables[(formattedText[i] as FormattedTextSet).name] = (formattedText[i] as FormattedTextSet).value;
        } else if (formattedText[i] instanceof FormattedTextClassClose) {
            textClasses.splice(textClasses.indexOf(formattedText[i] as string));
        } else if (formattedText[i] instanceof FormattedTextClassOpen) {
            textClasses.push(formattedText[i] as string);
        }
    }

    return { characters: characters, refs: characterRefs };
}