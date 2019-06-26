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

    public oldLines: THREE.Line[];
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

        this.oldLines = [];
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
    checkForCollision(collisionableEntities: Entity[], scene: THREE.Scene): boolean {
        //console.log(this.collisionMesh.geometry);
        for (var i = 0; i < this.oldLines.length; i++) {
            scene.remove(this.oldLines[i]);
        }
        this.oldLines = [];
        var geometry: THREE.Geometry = new THREE.Geometry().fromBufferGeometry(this.collisionMesh.geometry);
        //var geometry: THREE.Geometry = this.visualMesh.geometry as THREE.Geometry;
        if (geometry.vertices != undefined) {
            var collisionResults: THREE.Intersection[] = [];
            for (var vertexIndex = 0; vertexIndex < geometry.faces.length; vertexIndex++){
                this.collisionMesh.updateMatrixWorld();
                this.object.updateMatrixWorld();

                var startPosition = this.object.position;
                var worldPositionOfVertex = this.collisionMesh.localToWorld(geometry.faces[vertexIndex].normal);
                var direction = new Vector3();
                direction = direction.subVectors(this.object.position, worldPositionOfVertex);
                direction = direction.normalize();

                var raycaster: THREE.Raycaster = new THREE.Raycaster( startPosition, direction);
                var entities = collisionableEntities.filter((entity) => entity != this).map((entity) => entity.visualMesh);
                console.log(entities);
                collisionResults.concat(raycaster.intersectObjects(entities, true));
                
                //console.log("Ray origin: " + raycaster.ray.origin.toArray() + "  Ray direction: " + raycaster.ray.direction.toArray());

                var pointA = startPosition.clone();
                //var direction = this.object.localToWorld(localVertex).clone();

                var distance = 4; // at what distance to determine pointB

                var pointB = new THREE.Vector3();
                pointB.addVectors ( pointA, direction.multiplyScalar( distance ) );

                var lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push( pointA );
                lineGeometry.vertices.push( pointB );
                var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
                var line = new THREE.Line( lineGeometry, material );
                this.oldLines.push(line);
                scene.add(line);

                
            }
            //console.log(geometry.faces.length);
            return ( collisionResults.length > 0 && collisionResults[0].distance < direction.length() );
        } else {
            throw "Geometry has no vertices!"
        }
        /*for (var i = 0; i < collisionableEntities.length; i++) {
            return collisionableEntities[i].
        }*/
        //return false;
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