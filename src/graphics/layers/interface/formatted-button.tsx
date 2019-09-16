import * as React from "react";
import { FormattedText } from "./formatted-text";
import { FormattedTextComponent } from "./formatted-text-component";

interface FormattedButtonProps {
    formattedText: FormattedText;
    selectedCallback: () => void;
}

export class FormattedButton extends React.Component<FormattedButtonProps> {
    render() {
        return <button onClick={this.props.selectedCallback}><FormattedTextComponent formattedText={this.props.formattedText}></FormattedTextComponent></button>
    }
}