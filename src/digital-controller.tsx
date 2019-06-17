import { InputStatus } from "./player-input-manager";
import * as React from "react";

export class DigitalController extends React.Component<{inputStatus: InputStatus},{inputStatus: InputStatus}> {
    constructor(props: {inputStatus: InputStatus}) {
        super(props);
        this.state = props;
    }
    setStatus (inputStatus: InputStatus) {
        this.setState({inputStatus: inputStatus});
    }
    render() {
        return (
            <div className="DigitalControllerContainer">
                <div className="DigitalControllerStick">
                    <div className="DigitalControllerStickTop" style={{
                        transform: "translateX(calc(" + this.state.inputStatus.movement.controlVector.x * 50 + "px - 50%)) translateY(calc(" + this.state.inputStatus.movement.controlVector.y * -50 + "px - 50%))"
                       }}></div>
                </div>
            </div>
        );
    }
}