import { FormattedText, FormattedTextComponent } from "./formatted-text";
import { Vector2 } from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";

export interface ActionDescriptorProps {
    text: FormattedText;
    location: Vector2;
    hiding: boolean;
}

export class ActionDescriptor extends React.Component<ActionDescriptorProps,{}> {
    render() {
        return (
            <div className={`action-descriptor ${this.props.hiding ? "scroll-out" : ""}`} style={{
                "--x": this.props.location.x + "px",
                "--y": this.props.location.y + "px"
            } as any}>
                <FormattedTextComponent formattedText={this.props.text}></FormattedTextComponent>
            </div>
        );
    }
}