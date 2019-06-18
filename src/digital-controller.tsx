import { InputStatus } from "./player-input-manager";
import * as React from "react";
/*
const containerStyle = {
    position: "fixed",
    right: "0px",
    bottom: "0px",
    "--pressed": "rgba(0,0,0,1)",
    "--unpressed": "rgba(255, 255, 255, 1)"
};

const stickStyle = {
    width: "200px";
    height: "200px";
    background-color: var(--pressed);
    border-radius: 50%;
    position: relative;
};

const stickTopStyle  = {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    background-color: var(--unpressed);
    border-radius: 50%;
    position: absolute;
};
*/

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