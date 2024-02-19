import { Entity, GltfContainer, Transform, engine } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";

export class Buildings {

    static buildingsParent:Entity

    constructor(){

        // Parent
        Buildings.buildingsParent = engine.addEntity()
        Transform.create(Buildings.buildingsParent, {
            position: Vector3.create(16*10,0,16*11),
            rotation: Quaternion.fromEulerDegrees(0,180,0)
        })

        let stadium:Building = new Building("models/buildings/Stadium.glb")
        let tower:Building = new Building("models/buildings/Tower.glb")


        // let fw:Entity = engine.addEntity()
        // GltfContainer.create(fw,{src:"models/buildings/fw.glb"})
        // Transform.create(fw,{position:Vector3.create(8,2,22)})
    }
}

export class Building {
    constructor(_model:string){
        let entity:Entity = engine.addEntity()
        Transform.create(entity, {parent:Buildings.buildingsParent})
        GltfContainer.create(entity, {src:_model})
    }
}