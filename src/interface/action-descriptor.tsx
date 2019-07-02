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
                left: this.props.location.x,
                top: this.props.location.y,
                backgroundColor: "rgba(0,0,0,0.5)"
            }}>
                <FormattedTextComponent formattedText={this.props.text}></FormattedTextComponent>
            </div>
        );
    }
}