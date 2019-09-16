import { Entity } from "./entity";
import { PlayerInputManager } from "./player-input-manager";
import { Vector2 } from "three";
//import { Interface } from "./graphics/layers/interface/interface";
import { Localizer } from "./localizer";
//import 'three/examples/js/controls/OrbitControls';
import { RenderLayer } from "./graphics/layers/render-layer";
import { Layer } from "./graphics/layers/layer";

//TODO: Split up Game into App and RenderLayer

export class App {
    element: HTMLElement;
    
    playerInputManager: PlayerInputManager;
    //private interface: Interface;
    private entities: Entity[];
    
    public localizer: Localizer;
    
    public layers: Layer[];

    constructor() {
        this.localizer = new Localizer("english");

        this.layers = [];

        this.entities = [];
        //Adding our default CSS
        /*let cssLink = document.createElement("link");

        //TODO: upload the css file to GitHub pages
        cssLink.href = "http://127.0.0.1:5500/dist/defaultStyles.css";
        cssLink.rel = "stylesheet";
        document.head.appendChild(cssLink);*/

        //Player Input
        //var controllerDiv = document.createElement("div");
        /*PlayerInputManager.loadControlBindings().then((controlBindings) => {
            this.playerInputManager = new PlayerInputManager(controlBindings);
            this.interface = new Interface(this);
            this.element.appendChild(this.interface.element);
        });*/
        
        //THREE stuff
        //this.playerFollower = new Group();
        //this.playerFollower.position.set(0,0,0);



        //GUI
        this.element = document.createElement("div");

        this.update();
    }
    update() {
        //window.setTimeout(this.animate.bind(this), 150)
        requestAnimationFrame(this.update.bind(this));

        this.layers.forEach((layer) => layer.update());

        this.layers.forEach((layer, index) => {
            if (layer.element.parentElement != this.element) {
                this.element.appendChild(layer.element);
            }
            layer.element.style.zIndex = "-" + index;
        });
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(1);
        }
        /*if(this.playerInputManager) {
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
        }*/
        //this.renderer.render(this.scene,this.camera);
        //if (this.interface) {
        //    this.interface.update();
        //}
        
    }
    get collisionableEntities(): Entity[] {
        return this.entities.filter((entity) => entity.collidable)
    }
    /*get player() {
        return this._player;
    }
    set player(value: Entity) {
        this._player = value;
        this.directionalLight.target = value.object;
    }*/
    addEntity(entity: Entity, renderLayer: RenderLayer) {
        this.entities.push(entity);
        renderLayer.scene.add(entity.object);
    }
    
    getHoveredEntity(mousePos: Vector2) {
        for (let i = 0; i < this.layers.length; i++) {
            if (this.layers[i] instanceof RenderLayer) {
                const hoveredEntity = (this.layers[i] as RenderLayer).getHoveredEntity(mousePos);

                if (hoveredEntity) {
                    return hoveredEntity;
                }
            }
        }
    }
}