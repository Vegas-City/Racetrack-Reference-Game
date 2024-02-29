import { Entity, GltfContainer, Transform, engine } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import * as utils from '@dcl-sdk/utils'

export class Buildings {

    static buildingsParent: Entity

    constructor() {
 
        // Parent
        Buildings.buildingsParent = engine.addEntity()
        Transform.create(Buildings.buildingsParent, {
            position: Vector3.create(16 * 10, 0, 16 * 11),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0)
        }) 

        // Prioritise catching the player before they hit the floor
        let spawnCatcher: Building = new Building("models/buildings/SpawnCatcher.glb")

        utils.timers.setTimeout(()=>{
            let stadium: Building = new Building("models/buildings/Stadium.glb")
            let tower: Building = new Building("models/buildings/Tower.glb")
            let hq: Building = new Building("models/buildings/HQ.glb")
            let bridge: Building = new Building("models/buildings/Bridge.glb")
        },200)

        // let fw:Entity = engine.addEntity()
        // GltfContainer.create(fw,{src:"models/buildings/fw.glb"})
        // Transform.create(fw,{position:Vector3.create(8,2,22)})
    }
}

export class Building {
    constructor(_model: string) {
        let entity: Entity = engine.addEntity()
        Transform.create(entity, { parent: Buildings.buildingsParent })
        GltfContainer.create(entity, { src: _model })
    }
}