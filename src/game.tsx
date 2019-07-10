import * as THREE from "three";
import { Entity } from "./entity";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { DigitalController } from "./interface/digital-controller";
import { PlayerInputManager, ControlStatus } from "./player-input-manager";
import { Vector3, Vector2, Group, HemisphereLight, Color } from "three";
import { ActionDescriptor } from "./interface/action-descriptor";
import { Interface } from "./interface/interface";
import { Localizer } from "./localizer";
import { Mob } from "./mob";
import { CpuInfo } from "os";

export class Game {
    element: HTMLElement;
    readonly scene: THREE.Scene;
    readonly camera: THREE.Camera;
    readonly renderer: THREE.WebGLRenderer;
    party: Entity[];
    _player: Entity;
    playerInputManager: PlayerInputManager;
    private interface: Interface;
    private entities: Entity[];
    private directionalLight: THREE.DirectionalLight;
    public textVariables: {
        [index: string]: number | string;
    };
    private interfaceContainer: HTMLDivElement;
    public localizer: Localizer;
    private playerFollower: Group;
    readonly skyColor: Color;
    readonly groundColor: Color;

    constructor() {
        this.localizer = new Localizer("english");

        this.entities = [];
        this.textVariables = {};
        //Adding our default CSS
        var cssLink = document.createElement("link");

        //TODO: upload the css file to GitHub pages
        cssLink.href = "http://127.0.0.1:5500/dist/defaultStyles.css";
        cssLink.rel = "stylesheet";
        document.head.appendChild(cssLink);

        //Player Input
        //var controllerDiv = document.createElement("div");
        PlayerInputManager.loadControlBindings().then((controlBindings) => {
            this.playerInputManager = new PlayerInputManager(controlBindings);
            this.interface = new Interface(this);
            this.element.appendChild(this.interface.element);
        });
        
        //THREE stuff
        this.playerFollower = new Group();
        this.playerFollower.position.set(0,0,0);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.playerFollower.add(this.camera);
        this.camera.position.set(0,20,7);
        this.camera.rotation.set((-1.8 * Math.PI)/4, 0, 0); //rotation.set((-1.3 * Math.PI)/4, 0, 0);

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
        this.directionalLight.position.set( -30, 100, -30 );
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.bias = -0.001;
        this.directionalLight.shadow.camera.left = 20;
        this.directionalLight.shadow.camera.top = 20;
        this.directionalLight.shadow.camera.right = -20;
        this.directionalLight.shadow.camera.bottom = -20;
        this.directionalLight.shadow.mapSize = new Vector2(1024, 1024);
        
        this.playerFollower.add(this.directionalLight);
        
        //var helper = new THREE.CameraHelper( this.directionalLight.shadow.camera );
        //this.scene.add( helper );
        
        //var ambientLight = new THREE.AmbientLight( 0xffffff, 0.6);
        //this.scene.add(ambientLight);
        this.skyColor = new Color();
        this.groundColor = new Color();
        this.skyColor.setHSL( 0.6, 1, 0.6 );
        this.groundColor.setHSL( 0.095, 1, 0.75 );
        
        var hemisphereLight = new HemisphereLight(this.skyColor, this.groundColor, 0.6);
        this.scene.add(hemisphereLight);
        this.scene.background = new Color(this.skyColor);

        this.renderer = new THREE.WebGLRenderer(/*{alpha: true}*/);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.scene.add(this.playerFollower);

        //GUI
        this.element = document.createElement("div");
        this.element.appendChild(this.renderer.domElement);

        this.animate();
    }
    animate() {
        //window.setTimeout(this.animate.bind(this), 150)
        requestAnimationFrame(this.animate.bind(this));
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].update(1);
        }
        if(this.playerInputManager) {
            this.playerInputManager.update();
            // -->   this.interface.digitalController.setStatus(this.playerInputManager.inputStatus);
            if(this.player && this.player instanceof Mob) {
                //this.camera.lookAt(this.player.object.position);
                this.player.controlStatus = this.playerInputManager.inputStatus;
                //this.camera.position.addVectors(this.player.object.position, new Vector3(0,20,7));
                this.playerFollower.position.copy(this.player.object.position);
                //console.log(this.playerFollower.position);
                //this.camera.rotation.set(this.playerInputManager.controlVector.x * 0.5, this.playerInputManager.controlVector.y * 0.5, 0);
                //console.log(this.player.checkForCollision(this.collisionableEntities, this.scene));
            }
        }
        this.renderer.render(this.scene,this.camera);
        if (this.interface) {
            this.interface.update();
        }
        
    }
    get collisionableEntities(): Entity[] {
        return this.entities.filter((entity) => entity.collidable)
    }
    get player() {
        return this._player;
    }
    set player(value: Entity) {
        this._player = value;
        this.directionalLight.target = value.object;
    }
    addEntity(entity: Entity) {
        //console.log(entity);
        this.entities.push(entity);
        this.scene.add(entity.object);
    }
    getHoveredEntity(mouseClientLocation: Vector2): Entity {
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2(( mouseClientLocation.x / this.renderer.domElement.clientWidth ) * 2 - 1, - (mouseClientLocation.y / this.renderer.domElement.clientHeight) * 2 + 1);

        raycaster.setFromCamera( mouse, this.camera );

        var intersectedObject = raycaster.intersectObjects( this.entities.filter((entity) => entity.action).map((entity) => entity.object), true )[0];
        //console.log(intersectedObject);
        if (intersectedObject) {
            return this.entities.filter((entity) => intersectedObject.object == entity.visualMesh)[0];
        } else {
            return undefined;
        }
        
    }
}