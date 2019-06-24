import * as React from "react";
import { Vector3 } from "three";
import { lerp, wrapAroundLerp } from "./math";

var THREE = (window as any).THREE = require('three');
require("three/examples/js/loaders/GLTFLoader");

export class Entity {
    public object: THREE.Group;
    public gravity: boolean;
    private velocity: THREE.Vector3;
    public controlVector: THREE.Vector2;
    constructor(readonly visualMesh: THREE.Mesh, readonly collisionMesh: THREE.Mesh) {
        this.object = new THREE.Group();
        this.object.add(this.visualMesh);
        this.object.add(this.collisionMesh);
        this.object.castShadow = true;
        this.object.receiveShadow = true;
        this.collisionMesh.visible = false;
        this.gravity = false;
        this.velocity = new THREE.Vector3(0,0,0);
        this.controlVector = new THREE.Vector3(0,0,0);
    }
    /**
     * Function to be called every frame before render
     * @param deltaTime Time since the last frame
     */
    update(deltaTime: number) {
        if (this.gravity) {
            this.velocity.add(new Vector3(0,-0.2 * deltaTime,0))
        }
        this.object.position.add(this.velocity);
        this.velocity.multiplyScalar(0.95);

        var arr = this.controlVector.toArray();
        arr.splice(1,0,0);
        this.object.position.add((new Vector3()).fromArray(arr).multiplyScalar(0.2));
        if (this.controlVector.length() > 0) {
            //console.log("Control Vector: " + this.controlVector.angle() * (180/Math.PI) + "  Current Rotation: " + this.object.rotation.y * (180/Math.PI));
            this.object.rotation.y = wrapAroundLerp(this.object.rotation.y, this.controlVector.setX(this.controlVector.x * -1).angle(), 0.1, Math.PI * 2);
        }
    }
    /*checkForCollision(otherEntity: Entity): boolean {
        for (var vertexIndex = 0; vertexIndex < this.collisionMesh.geometry.vertices.length; vertexIndex++){       
            var localVertex = (this.object.collisionMesh as any).geometry.vertices[vertexIndex].clone();
            var globalVertex = (this.object.collisionMesh as any).matrix.multiplyVector3(localVertex);
            var directionVector = globalVertex.subSelf( (this.collisionMesh as any).position );

            var ray = new THREE.Ray( (this.collisionMesh as any).position, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( collidableMeshList );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
            {
                // a collision occurred... do something...
            }
        }
    }*/

    /**
     * Loads a collisionable entity from the paths given in the two parameters. This does not actually put the entity in the game; it just loads it into memory.
     * @param visualMeshPath 
     * @param collisionMeshPath 
     */
    static load(entityName: string): Promise<Entity>{
        
        var loader = new (THREE as any).GLTFLoader();
        var visualMeshPath = "assets/entities/" + entityName + "/mesh.glb";
        var collisionMeshPath = "assets/entities/" + entityName + "/collision.glb";

        return new Promise((resolve, reject) => {
            var visualMesh: THREE.Mesh;
            var collisionMesh: THREE.Mesh;
            var attemptToResolve = () => {
                if (visualMesh && collisionMesh) {
                    resolve(new Entity(visualMesh,collisionMesh))
                }
            }
            loader.load(visualMeshPath, (returnedValue: any /*Suppose to be an object?*/) => {
                visualMesh = returnedValue.scene.children[0];
                attemptToResolve();
            }, undefined, reject);
            loader.load(collisionMeshPath, (returnedValue: any) => {
                collisionMesh = returnedValue.scene.children[0];
                attemptToResolve();
            }, undefined, reject);
        })
    }
}