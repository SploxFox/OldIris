import * as React from "react";

var THREE = (window as any).THREE = require('three');
require("three/examples/js/loaders/GLTFLoader");

export class Entity {
    public object: THREE.Group;
    constructor(readonly visualMesh: THREE.Mesh, readonly collisionMesh: THREE.Mesh) {
        this.object = new THREE.Group();
        this.object.add(this.visualMesh);
        this.object.add(this.collisionMesh);
        this.collisionMesh.visible = false;
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