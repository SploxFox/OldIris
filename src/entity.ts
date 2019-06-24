import * as React from "react";
import { Vector3, Geometry, Vector } from "three";
import { lerp, wrapAroundLerp } from "./math";

var THREE = (window as any).THREE = require('three');
require("three/examples/js/loaders/GLTFLoader");

export class Entity {
    public object: THREE.Group;
    public gravity: boolean;
    private velocity: THREE.Vector3;
    public controlVector: THREE.Vector2;
    public collidable: boolean;
    constructor(readonly visualMesh: THREE.Mesh, readonly collisionMesh?: THREE.Mesh) {
        this.object = new THREE.Group();
        this.object.add(this.visualMesh);
        if (collisionMesh) {
            this.object.add(this.collisionMesh);
            this.collidable = true;
        } else {
            this.collidable = false;
        }
        
        this.visualMesh.castShadow = true;
        this.visualMesh.receiveShadow = true;
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
    checkForCollision(collisionableEntities: Entity[]): boolean {
        //console.log(this.collisionMesh.geometry);
        var geometry = new THREE.Geometry().fromBufferGeometry(this.collisionMesh.geometry);
        if (geometry.vertices != undefined) {
            for (var vertexIndex = 0; vertexIndex < geometry.vertices.length; vertexIndex++){       
                var localVertex: Vector3 = geometry.vertices[vertexIndex].clone();
                //var globalVertex = this.collisionMesh.matrix.multiplyVector3(localVertex);
                var globalVertex = localVertex.applyMatrix4(this.collisionMesh.matrix);
                var directionVector = globalVertex.sub( this.collisionMesh.position );
    
                var ray = new THREE.Raycaster( this.collisionMesh.position, directionVector.clone().normalize() );
                //console.log(collisionableEntities.filter((entity) => entity != this).map((entity) => entity.collisionMesh));
                var collisionResults = ray.intersectObjects(collisionableEntities.filter((entity) => entity != this).map((entity) => entity.collisionMesh));
                return ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
            }
        } else {
            throw "Geometry has no vertices!"
        }
    }

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