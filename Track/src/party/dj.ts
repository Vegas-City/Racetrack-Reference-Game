import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class DJ {
    entity:Entity
    constructor(){
        this.entity = engine.addEntity()
        Transform.create(this.entity, {position:Vector3.create(75,4,85), rotation:Quaternion.fromEulerDegrees(0,-90,0),scale:Vector3.create(1.3,1.3,1.3)})
        GltfContainer.create(this.entity, {src:"models/npcs/dj.glb"})
    }

    remove(){
        engine.removeEntity(this.entity)
    }
} 