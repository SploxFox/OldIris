import { FormattedText, FormattedTextComponent } from "./formatted-text";
import { Vector2 } from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";

export interface ActionDescriptorProps {
    label: FormattedText;
    location: Vector2;
}

export class ActionDescriptor extends React.Component<ActionDescriptorProps,{}> {
    render() {
        return (
            <div className="action-descriptor" style={{
                left: this.props.location.x,
                top: this.props.location.y
            }}>
                <FormattedTextComponent formattedText={this.props.label}></FormattedTextComponent>
            </div>
        );
    }
}