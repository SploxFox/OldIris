import { ControlBindings, defaultControls, BoundKey } from "./controls";
import { Vector2 } from "three";

export interface ControlStatus {
    movement: {
        controlVector: Vector2;
        jump: boolean;
        sneak: boolean;
        sprint: boolean;
    },
}

export class PlayerInputManager {
    private keysDown: string[];
    public inputStatus: ControlStatus;
    constructor(readonly controlBindings: ControlBindings) {
        this.keysDown = [];
        window.addEventListener("keydown",(ev) => {
            if (!this.keysDown.includes(ev.code)) {
                this.keysDown.push(ev.code);
                //console.log(this.keysDown);
            }
            
        });
        window.addEventListener("keyup", (ev) => {
            this.keysDown.splice(this.keysDown.indexOf(ev.code),1);
            ///console.log(this.keysDown);
        });
        this.inputStatus = {
            movement: {
                controlVector: new Vector2(0,0),
                jump: false,
                sneak: false,
                sprint: false,
            }
        };
        
    }

    update() {
        this.inputStatus = {
            movement: {
                controlVector: undefined,
                jump: false,
                sneak: false,
                sprint: false,
            }
        };
        for (var control in this.controlBindings.movement) {
            if (control == "directions") {
                continue;
            } else if (this.keysDown.includes(((this.controlBindings.movement as any)[control] as BoundKey).code)) {
                (this.inputStatus.movement as any)[control] = true;
            }
        };
        this.inputStatus.movement.controlVector = this.controlVector;
        console.table(this.inputStatus.movement);
        //console.log(this.keysDown);
    }

    /**
     * The vector that the player is controlling themselves in.
     * Does not factor in sprinting or other effects like that.
     */
    get controlVector(): Vector2 {
        return Object.values(this.controlBindings.movement.directions).filter((binding) => this.keysDown.includes(binding.code)).map((binding) => (new Vector2()).fromArray(binding.direction)).reduce((accumulator, currentValue) => accumulator.add(currentValue), new Vector2(0,0)).normalize();
    }

    static loadControlBindings(): Promise<ControlBindings> {
        return new Promise((resolve,reject) => {
            const request = new XMLHttpRequest();
            request.addEventListener("readystatechange",() => {
                if (request.status == 404) {
                    resolve(defaultControls);
                } else if (request.readyState == 4) {
                    resolve(Object.assign(defaultControls,JSON.parse(request.responseText)));
                }
            });
            request.open("GET","defaultControls.json");
            request.send();
        });
    }
}