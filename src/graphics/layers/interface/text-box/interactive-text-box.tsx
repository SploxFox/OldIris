import * as React from "react";
import { TextBox, TextBoxProps } from "./text-box";
import { FormattedText } from "../formatted-text";
import { ContinueArrow } from "./continue-arrow";

interface Story {
    [index: string]: FormattedText
}

export interface InteractiveTextBoxProps {
    content: FormattedText | {
        story: Story,
        startPosition: string;
    };
    textBoxProps?: Partial<TextBoxProps>;
}

interface InteractiveTextBoxState {
    stopped: boolean;
    speaker: string;
    story: Story;
    storyPosition: string;
    locked: boolean;
}

export class InteractiveTextBox extends React.Component<InteractiveTextBoxProps, InteractiveTextBoxState>{
    textBox: TextBox;
    constructor(props: InteractiveTextBoxProps) {
        super(props);

        this.state = {
            stopped: false,
            locked: false,
            speaker: "Test",
            story: this.props.content instanceof FormattedText ? {"start": this.props.content} : this.props.content.story,
            storyPosition: this.props.content instanceof FormattedText ? "start" : this.props.content.startPosition
        }

        //this.textBoxComponent = this.generateNewTextBox(this.props.content instanceof FormattedText ? this.props.content : this.props.content.story[this.props.content.startPosition]);
    }
    render() {
        //console.log(this);
        //<span>{this.state.speaker}</span><br></br>

        //{this.state.stopped ? <ContinueArrow></ContinueArrow> : ""}

        /*
        ref={(tb: TextBox) => {
                        tb != null && !tb.state.stopped && tb.start()
                    }}
                    */
        console.log(this.state.storyPosition);
        const textBoxProps = {
            formattedText: this.state.story[this.state.storyPosition],
            textStartedCallback: () => this.setState({stopped: false}),
            textStoppedCallback: () => this.setState({stopped: true}),
            allTextFinishedCallback: () => {this.setState({stopped: true})},
            textFunctions: {
                enter: () => {},
                exit: () => {},
                setSpeaker: (args: {newSpeaker: string}) => this.setState({speaker: args.newSpeaker}),
                jump: (args: {destination: string}) => this.jump(args.destination)
            },
            ref: (tb: TextBox) => this.textBox = tb,
            key: this.state.storyPosition
        };

        if (this.props.textBoxProps) {
            const textFunctions = textBoxProps.textFunctions;
            const newTextFunctions = this.props.textBoxProps.textFunctions;

            Object.assign(textFunctions, newTextFunctions);

            Object.assign(textBoxProps, this.props.textBoxProps);

            textBoxProps.textFunctions = textFunctions;
        }

        console.log(textBoxProps);
        return(
            <div className="interactive-text-box">
                {React.createElement(TextBox, textBoxProps, null)}
            </div>
        )
    }
    /*generateNewTextBox(formattedText: FormattedText) {
        return (
            <TextBox formattedText={formattedText} 
                textStartedCallback={() => this.setState({stopped: false})}
                textStoppedCallback={() => this.setState({stopped: true})}
                allTextFinishedCallback={() => {this.setState({stopped: true})}}
                textFunctions={{
                    enter: () => {},
                    exit: () => {},
                    setSpeaker: (args: {newSpeaker: string}) => this.setState({speaker: args.newSpeaker}),
                    jump: (args: {destination: string}) => this.jump(args.destination)
                }}
                ref={(tb: any) => {
                    this.textBox = tb; tb.start()
                }}
            >

            </TextBox>
        );
    }*/
    jump(destination: string) {
        //this.textBoxComponent = this.generateNewTextBox((this.props.content as any).story[destination]);
        this.setState({storyPosition: destination});
        this.forceUpdate();
        this.textBox.start();
    }
}