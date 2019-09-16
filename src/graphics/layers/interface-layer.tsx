import { Layer } from "./layer";
import { DigitalController } from "./interface/digital-controller";
import { InterfaceComponent } from "./interface/interface";
import { App } from "../../app";
import * as ReactDOM from "react-dom";
import * as React from "react";

export class Interface extends Layer {
    digitalController: DigitalController;
    interfaceComponent: InterfaceComponent;
    constructor(readonly game: App) {
        super();
        ReactDOM.render(<InterfaceComponent interface={this} ref={(ic) => this.interfaceComponent = ic}></InterfaceComponent>, this.element);
    }

    update() {
        if (this.digitalController) {
            this.digitalController.setStatus(this.game.playerInputManager.inputStatus);
        } else if (this.game.playerInputManager) {
            
        }
        
    }
}