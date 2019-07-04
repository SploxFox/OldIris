import { FormattedText, FormattedTextComponent } from "./formatted-text";
import { Vector2 } from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";

export interface ActionDescriptorProps {
    text: FormattedText;
    location: Vector2;
}

export class ActionDescriptor extends React.Component<ActionDescriptorProps,{}> {
    render() {
        return (
            <div className="action-descriptor" style={{
                "--x": this.props.location.x + "px",
                "--y": this.props.location.y + "px"
            } as any}>
                <FormattedTextComponent formattedText={this.props.text}></FormattedTextComponent>
            </div>
        );
    }
}