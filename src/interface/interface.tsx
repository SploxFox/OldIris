import * as React from "react";
import { DigitalController } from "./digital-controller";
import { PlayerInputManager } from "../player-input-manager";
import { Game } from "..";
import * as ReactDOM from "react-dom";
import { Vector2 } from "three";
import { ActionDescriptor } from "./action-descriptor";

export class Interface {
    digitalController: DigitalController;
    interfaceComponent: InterfaceComponent;
    element: HTMLElement;
    constructor(readonly game: Game) {
        this.element = document.createElement("div");
        ReactDOM.render(<InterfaceComponent interface={this} ref={(ic) => this.interfaceComponent = ic}></InterfaceComponent>, this.element);
    }

    update() {
        if (this.digitalController) {
            this.digitalController.setStatus(this.game.playerInputManager.inputStatus);
        } else if (this.game.playerInputManager) {
            
        }
        
    }
}

export class InterfaceComponent extends React.Component<{interface: Interface},{mouseClientPos: Vector2, hiding: boolean}> {
    private hideTimeout: number;
    constructor(props: any) {
        super(props);
        
        window.addEventListener("mousemove", this.updateMouseTooltip);
        this.state = {
            mouseClientPos: new Vector2(0,0),
            hiding: true
        }
    }

    updateMouseTooltip(event: MouseEvent) {
        this.setState({
            mouseClientPos: new Vector2(event.clientX, event.clientY)
        });
    }

    render() {
        return (
            <div>
                <DigitalController ref={(dc) => this.props.interface.digitalController = dc} inputStatus={this.props.interface.game.playerInputManager.inputStatus}></DigitalController>
                <div className={this.state.hiding ? "scroll-out" : ""}>
                    <ActionDescriptor location={this.state.mouseClientPos} text={this.props.interface.game.getHoveredEntity(mouseClientPos)}></ActionDescriptor>
                </div>
            </div>
        );
    }
}

//What to do: create a CSS class with an animation to hide the tooltip and then apply the class after some time after a mouse move