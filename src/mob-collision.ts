import { Entity } from "./entity";
import { Raycaster, Vector3, Object3D } from "three";
import { CollisionProperties } from "./mob";

export class MobCollision {
    _downRaycaster: Raycaster;
    readonly downSnapRange: number;
    downLength: number;
    constructor(readonly collisionProperties: CollisionProperties) {
        this.downSnapRange = 0.1;
        this.downLength = collisionProperties.downLength;
        this._downRaycaster = new Raycaster(new Vector3(0,0,0), new Vector3(0, -1, 0), 0, this.downLength + this.downSnapRange);
    }
    getDownRaycaster(currentPosition: Vector3) {
        this._downRaycaster.ray.origin = currentPosition;
        return this._downRaycaster;
    }
    
    /**
     * Mobs cannot exist in places that do not have floors below them. This gets the next position for a mob that has a floor below it.
     * 
     * @param currentPosition The current position of the mob.
     * @param nextPosition The position that the mob is trying to move to.
     * @param collisionMeshes The floors that the mob can be above.
     */
    getNextValidPosition(currentPosition: Vector3, nextPosition: Vector3, collisionMeshes: Object3D[]) {
        //var wallsRaycaster = new Raycaster(currentPosition, nextPosition.clone().sub(currentPosition).normalize(), 0, )
        var floorRaycaster = new Raycaster(nextPosition, new Vector3(0, -1, 0), 0, 1000);
        if (floorRaycaster.intersectObjects(collisionMeshes).length > 0) {
            return nextPosition;
        } else {
            //Player is trying to get out of bounds
            return currentPosition;
        }
    }
}