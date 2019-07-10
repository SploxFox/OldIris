import { Mesh } from "three";

export class CollisionMesh {
    readonly walls: Mesh;
    constructor(readonly floors: Mesh) {
        
    }
}