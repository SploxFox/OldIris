import * as React from "react";
import { DigitalController } from "./digital-controller";
import { Vector2 } from "three";
import { ActionDescriptor } from "./action-descriptor";
import { Entity } from "../../../entity";
import { Interface } from "../interface-layer";

const coverStyle: React.CSSProperties = {
    position: "absolute",
    left: "0px",
    right: "0px",
    top: "0px",
    bottom: "0px"
}
export class InterfaceComponent extends React.Component<{interface: Interface},{mouseClientPos: Vector2, hiding: boolean, hoveredEntity: Entity}> {
    constructor(props: any) {
        super(props);

        window.addEventListener("mousemove", this.updateMouseTooltip.bind(this));
        this.state = {
            mouseClientPos: new Vector2(0,0),
            hiding: true,
            hoveredEntity: undefined
        }
    }

    updateMouseTooltip(event: MouseEvent) {
        const hoveredEntity = this.props.interface.game.getHoveredEntity(this.state.mouseClientPos);
        //console.log(hoveredEntity);
        this.setState({
            mouseClientPos: new Vector2(event.clientX, event.clientY),
            hoveredEntity: hoveredEntity ? hoveredEntity : this.state.hoveredEntity,
            hiding: hoveredEntity == undefined
        });
    }

    render() {
        return (
            <div style={coverStyle}>
                <DigitalController ref={(dc) => this.props.interface.digitalController = dc} inputStatus={this.props.interface.game.playerInputManager.inputStatus}></DigitalController>
                {this.state.hoveredEntity ? <ActionDescriptor hiding={this.state.hiding} location={this.state.mouseClientPos} text={this.state.hoveredEntity.action.displayText}></ActionDescriptor> : null}
            </div>
        );
    }
}

//What to do: create a CSS class with an animation to hide the tooltip and then apply the class after some time after a mouse move
//Perhaps the Interface and InterfaceComponent classes should be merged