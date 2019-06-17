export interface BoundKey {
    code: string;
    keyCode?: number;
}
export interface BoundMovementKey extends BoundKey {
    direction: number[];
}
export interface ControlBindings {
    movement: {
        directions: {
            forwards: BoundMovementKey,
            backwards: BoundMovementKey,
            left: BoundMovementKey,
            right: BoundMovementKey
        },
        sprint: BoundKey,
        sneak: BoundKey,
        jump: BoundKey
    }
}
export const defaultControls: ControlBindings = {
    movement: {
        directions: {
            forwards: {
                "code": "KeyW",
                "direction": [0, 1]
            },
            backwards: {
                "code": "KeyS",
                "direction": [0, -1]
            },
            right: {
                "code": "KeyD",
                "direction": [1, 0]
            },
            left: {
                "code": "KeyA",
                "direction": [-1, 0]
            }
        },
        sprint: {
            code: "ControlLeft"
        },
        sneak: {
            code: "ShiftLeft"
        },
        jump: {
            code: "Space"
        }
    }

}