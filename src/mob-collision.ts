import { Entity } from "./entity";
import { Raycaster, Vector3 } from "three";
import { CollisionProperties } from "./mob";

export class MobCollision {
    _downRaycaster: Raycaster;
    readonly downSnapRange: number;
    downLength: number;
    constructor(readonly entity: Entity, readonly collisionProperties: CollisionProperties) {
        this.downSnapRange = 0.05;
        this.downLength = collisionProperties.downLength;
        this._downRaycaster = new Raycaster(this.entity.object.position, new Vector3(0, -1, 0), 0, this.downLength + this.downSnapRange);
    }
    get downRaycaster() {
        this._downRaycaster.ray.origin = this.entity.object.position;
        return this._downRaycaster;
    }
}