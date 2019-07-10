import { Entity } from "./entity";
import { Mesh, Vector3, Vector2, Raycaster, Intersection } from "three";
import { Game } from ".";
import { wrapAroundLerp } from "./math";
import { MobCollision } from "./mob-collision";
import { ControlStatus } from "./player-input-manager";

export interface CollisionProperties {
    downLength: number,
    sideLength: number
}
export class Mob extends Entity {
    private velocity: Vector3;
    public gravity: boolean;
    public controlStatus: ControlStatus;
    public mobCollision: MobCollision;

    constructor(game: Game, visualMesh: Mesh, collisionMesh: Mesh, collisionProperties: CollisionProperties) {
        super(game, visualMesh, collisionMesh)
        this.velocity = new Vector3(0,0,0);
        this.gravity = false;
        this.controlStatus = {
            movement: {
                controlVector: new Vector2(0,0),
                jump: false,
                sneak: false,
                sprint: false
            }
        }

        this.mobCollision = new MobCollision(collisionProperties);
    }
     /**
     * Function to be called every frame before render
     * @param deltaTime Time since the last frame
     */
    update(deltaTime: number) {
        super.update(deltaTime);

        var downIntersection = this.castToGround()[0];
        var controlInfluence = 0.01;
        if (downIntersection) {
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
            }
            this.snapToGround(downIntersection);
            this.velocity.multiplyScalar(0.5);
            controlInfluence = 0.2;
        } else if (this.gravity) {
            this.velocity.add(new Vector3(0,-0.05 * deltaTime,0))
        }
        //this.object.position.add(this.velocity);
        var arr = this.controlStatus.movement.controlVector.toArray();
        arr.splice(1,0,0);
        this.velocity.add((new Vector3()).fromArray(arr).multiplyScalar(controlInfluence));

        var nextPosition = this.mobCollision.getNextValidPosition(this.object.position, this.object.position.clone().add(this.velocity), this.game.collisionableEntities.filter((entity) => entity != this).map((entity) => entity.visualMesh));
        this.object.position.set(nextPosition.x, nextPosition.y, nextPosition.z);

        this.velocity.multiplyScalar(0.95);

        
        if (this.controlStatus.movement.controlVector.length() > 0) {
            //console.log("Control Vector: " + this.controlVector.angle() * (180/Math.PI) + "  Current Rotation: " + this.object.rotation.y * (180/Math.PI));
            this.object.rotation.y = wrapAroundLerp(this.object.rotation.y, this.controlStatus.movement.controlVector.setX(this.controlStatus.movement.controlVector.x * -1).angle(), 0.1, Math.PI * 2);
        }
        if (this.controlStatus.movement.jump && downIntersection) {
            this.velocity.add(new Vector3(0,0.5,0));
            console.log("jump");
        }
    }
    get onGround(): boolean {
        return this.castToGround().length > 0;
    }
    castToGround(): Intersection[] {
        return this.mobCollision.getDownRaycaster(this.object.position).intersectObjects(this.game.collisionableEntities.filter((entity) => entity != this).map((entity) => entity.visualMesh), true);
    }
    snapToGround(groundIntersection: Intersection) {
        this.object.position.y = groundIntersection.point.y + this.mobCollision.downLength;
    }

    static load: Function = (entityName: string, game: Game, collisionProperties: CollisionProperties, language?: string) => {
        return Entity.loadMeshes(entityName, game, language).then((value) => {
            return new Mob(game, value.visualMesh, value.collisionMesh, collisionProperties);
        })
    }
}