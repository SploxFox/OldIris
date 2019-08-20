import * as React from "react";
import { FormattedText, FormattedTextCharacter, FormattedTextClassClose, FormattedTextClassOpen, FormattedTextSet, FormattedTextString } from "./formatted-text";

export interface FormattedTextComponentProps {
    formattedText: FormattedText
}
export class FormattedTextComponent extends React.Component<FormattedTextComponentProps, {}> {
    render() {
        let characters = [];
        let textClasses = [];
        for (var i = 0; i < this.props.formattedText.length; i++) {
            //characters.push(this.state.allText[i]);
            if (typeof this.props.formattedText[i] == "string") {
                characters.push(<FormattedTextCharacter character={this.props.formattedText[i] as string} classes={textClasses}></FormattedTextCharacter>);
            } else if (this.props.formattedText[i] instanceof FormattedTextString) {
                characters.push(<FormattedTextCharacter character={(this.props.formattedText[i] as FormattedTextString).string} classes={(this.props.formattedText[i] as FormattedTextString).classes}></FormattedTextCharacter>)
            }else if (this.props.formattedText[i] instanceof FormattedTextSet) {
                //this.textVariables[(this.props.formattedText[i] as FormattedTextSet).name] = (this.props.formattedText[i] as FormattedTextSet).value;
            } else if (this.props.formattedText[i] instanceof FormattedTextClassClose) {
                textClasses.splice(textClasses.indexOf(this.props.formattedText[i] as string));
            } else if (this.props.formattedText[i] instanceof FormattedTextClassOpen) {
                textClasses.push(this.props.formattedText[i] as string);
            }
        }

        return(
            <span className="formattedText">{
                characters
            }</span>
        )
    }    
}