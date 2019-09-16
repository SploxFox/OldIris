import THREE = require("three");
import { Color, Vector2, HemisphereLight } from "three";
import { Layer } from "./layer";
import { Entity } from "../../entity";

export class RenderLayer extends Layer {

    public entities: Entity[];

    readonly scene: THREE.Scene;
    readonly camera: THREE.Camera;
    readonly renderer: THREE.WebGLRenderer;
    private directionalLight: THREE.DirectionalLight;
    readonly skyColor: Color;
    readonly groundColor: Color;

    private canvas: HTMLCanvasElement;
    

    constructor() {
        super();
        

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        //this.playerFollower.add(this.camera);
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
        
        //this.playerFollower.add(this.directionalLight);
        
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

        this.canvas = this.renderer.domElement;
        this.element.appendChild(this.canvas);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
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