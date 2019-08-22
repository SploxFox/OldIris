import * as React from "react";
import { TextBox } from "./text-box";
import { FormattedText } from "../formatted-text";
import { ContinueArrow } from "./continue-arrow";

interface InteractiveTextBoxProps {
    formattedText: FormattedText
}

interface InteractiveTextBoxState {
    stopped: boolean;
    speaker: string;
}

export class InteractiveTextBox extends React.Component<InteractiveTextBoxProps, InteractiveTextBoxState>{
    textBoxComponent: any;
    textBox: TextBox;
    constructor(props: InteractiveTextBoxProps) {
        super(props);

        this.state = {
            stopped: false,
            speaker: "Test"
        }

        this.textBoxComponent = <TextBox formattedText={this.props.formattedText} textStartedCallback={() => this.setState({stopped: false})} textStoppedCallback={() => this.setState({stopped: true})} allTextFinishedCallback={() => {this.setState({stopped: true})}} textFunctions={{
            enter: () => {},
            exit: () => {},
            setSpeaker: (args: {newSpeaker: string}) => this.setState({speaker: args.newSpeaker})
        }} ref={(tb: any) => {
            this.textBox = tb; tb.start()
        }}></TextBox>;
    }
    render() {
        return(
            <div className="interactive-text-box">
                <span>{this.state.speaker}</span><br></br>
                {this.textBoxComponent}
                {this.state.stopped ? <ContinueArrow></ContinueArrow> : ""}
            </div>
        )
    }
}