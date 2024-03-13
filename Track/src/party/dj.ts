import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class DJ {
    entity:Entity
    constructor(){
        this.entity = engine.addEntity()
        Transform.create(this.entity, {position:Vector3.create(75,4,81), rotation:Quaternion.fromEulerDegrees(0,-30,0),scale:Vector3.create(1,1,1)})
        GltfContainer.create(this.entity, {src:"models/npcs/dj.glb"})
    }

    remove(){
        engine.removeEntity(this.entity)
    }
} 