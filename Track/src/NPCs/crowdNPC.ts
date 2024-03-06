import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Buildings } from "../Buildings/Buildings";
import { Vector3 } from "@dcl/sdk/math";

export class CrowdNPC {
    entity: Entity
    static instance: CrowdNPC

    constructor(){
        CrowdNPC.instance = this
        this.entity = engine.addEntity()
        Transform.create(this.entity, { parent: Buildings.buildingsParent, scale:Vector3.Zero()})
        GltfContainer.create(this.entity, { src: "models/npcs/Crowd.glb" })        
    }

    hide(){
        let transform = Transform.getMutableOrNull(this.entity)
        if(transform!=null){
            transform.scale=Vector3.Zero()
        }
    }

    show(){
        let transform = Transform.getMutableOrNull(this.entity)
        if(transform!=null){
            transform.scale=Vector3.One()
        }
    }
}