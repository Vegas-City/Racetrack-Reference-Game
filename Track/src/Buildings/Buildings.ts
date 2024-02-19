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

        // let tribunes:Building = new Building("models/buildings/Tribunes.glb")
        // let bridge:Building = new Building("models/buildings/Bridges.glb")
        // let tower:Building = new Building("models/buildings/Tower.glb")
        // let pitstops:Building = new Building("models/buildings/Pitstops.glb")
        // let entranceFloor:Building = new Building("models/buildings/EntranceFloor.glb")
    }
}

export class Building {
    constructor(_model:string){
        let entity:Entity = engine.addEntity()
        Transform.create(entity, {parent:Buildings.buildingsParent})
        GltfContainer.create(entity, {src:_model})
    }
}