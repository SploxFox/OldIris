import * as THREE from "three";
import { Entity } from "./entity";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { DigitalController } from "./digital-controller";
import { PlayerInputManager, InputStatus } from "./player-input-manager";
import { Vector3 } from "three";

export class Game {
    element: HTMLElement;
    readonly scene: THREE.Scene;
    readonly camera: THREE.Camera;
    readonly renderer: THREE.Renderer;
    party: Entity[];
    player: Entity;
    playerInputManager: PlayerInputManager;
    digitalController: DigitalController;
    private entities: Entity[];
    constructor() {
        this.entities = [];
        //Adding our default CSS
        var cssLink = document.createElement("link");

        //TODO: upload the css file to GitHub pages
        cssLink.href = "http://127.0.0.1:5500/dist/defaultStyles.css";
        cssLink.rel = "stylesheet";
        document.head.appendChild(cssLink);

        //Player Input
        var controllerDiv = document.createElement("div");
        PlayerInputManager.loadControlBindings().then((controlBindings) => {
            this.playerInputManager = new PlayerInputManager(controlBindings);
            
            ReactDOM.render(<DigitalController ref={(dc) => this.digitalController = dc} inputStatus={this.playerInputManager.inputStatus}></DigitalController>, controllerDiv);
        });

        //THREE stuff
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0,10,10);
        this.camera.rotation.set((-1.3 * Math.PI)/4, 0, 0); //rotation.set((-1.3 * Math.PI)/4, 0, 0);

        /*var light = new THREE.PointLight( 0xff0000, 1, 100 );
        light.position.set( 50, 50, 50 );
        this.scene.add( light );*/
        var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer(/*{alpha: true}*/);
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        //GUI
        this.element = document.createElement("div");
        this.element.appendChild(this.renderer.domElement);
        this.element.appendChild(controllerDiv);

        this.animate();
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].update(1);
        }
        if(this.playerInputManager) {
            this.playerInputManager.update();
            this.digitalController.setStatus(this.playerInputManager.inputStatus);
            if(this.player) {
                //this.camera.lookAt(this.player.object.position);
                var arr = this.playerInputManager.controlVector.toArray();
                arr.splice(1,0,0);
                this.player.object.position.add((new Vector3()).fromArray(arr).multiplyScalar(0.2));
                //this.camera.rotation.set(this.playerInputManager.controlVector.x * 0.5, this.playerInputManager.controlVector.y * 0.5, 0);
            }
        }
        this.renderer.render(this.scene,this.camera);
    }
    addEntity(entity: Entity) {
        //console.log(entity);
        this.entities.push(entity);
        this.scene.add(entity.object);
    }
}