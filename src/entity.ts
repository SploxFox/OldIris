import * as React from "react";
import { Vector3, Geometry, Vector, Raycaster } from "three";
import { lerp, wrapAroundLerp } from "./math";
import { FormattedText } from "./interface/formatted-text";
import { Game } from "./game";

var THREE = (window as any).THREE = require('three');
require("three/examples/js/loaders/GLTFLoader");

export class EntityAction {
    range: number;
    displayText: FormattedText;
    constructor(private game: Game, public actionName: string) {
        game.localizer.actionDescriptors.then((localizations) => {
            this.displayText = FormattedText.parse(localizations[this.actionName]);
        });
    }
}
export class Entity {
    public object: THREE.Group;
    public gravity: boolean;
    private velocity: THREE.Vector3;
    public controlVector: THREE.Vector2;
    public collidable: boolean;

    public oldLines: THREE.Line[];
    public action: EntityAction;
    constructor(readonly visualMesh: THREE.Mesh, readonly collisionMesh?: THREE.Mesh, readonly game: Game) {
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
        if (this.gravity && !this.onGround) {
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
    get onGround(): boolean {
        var raycaster = new Raycaster(this.object.position, new Vector3(0, -1, 0), 0, 4);
        var collisionableMeshes = this.game.collisionableEntities.filter((entity) => entity != this).map((entity) => entity.visualMesh);
        return raycaster.intersectObjects(collisionableMeshes, true).length > 0;
    }

    /**
     * Loads a collisionable entity from the paths given in the two parameters. This does not actually put the entity in the game; it just loads it into memory.
     * @param entityName The name of the entity (AKA the location of the entity's folder)
     * @param lanugage The language of the mesh for those language-specific meshes. Do not include anything for universal meshes.
     */
    static load(entityName: string, game: Game, language?: string): Promise<Entity>{
        
        var loader = new (THREE as any).GLTFLoader();
        const folderLocation = `assets/${language ? language : "universal"}/entities/${entityName}/`;
        const visualMeshPath = `${folderLocation}/mesh.glb`;
        const collisionMeshPath = `${folderLocation}/collision.glb`;

        return new Promise((resolve, reject) => {
            var visualMesh: THREE.Mesh;
            var collisionMesh: THREE.Mesh;
            var attemptToResolve = () => {
                if (visualMesh && collisionMesh) {
                    resolve(new Entity(visualMesh,collisionMesh, game))
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

//This was the old code for entity collision that didn't work

//console.log(this.collisionMesh.geometry);
/*for (var i = 0; i < this.oldLines.length; i++) {
    scene.remove(this.oldLines[i]);
}
this.oldLines = [];
/*var geometry: THREE.Geometry = new THREE.Geometry().fromBufferGeometry(this.collisionMesh.geometry);
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
        //console.log(entities);
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