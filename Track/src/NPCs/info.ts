import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export class Info {
    constructor(_position: Vector3) {
        let entity: Entity = engine.addEntity()
        Transform.createOrReplace(entity, {
            position: Vector3.add(_position, Vector3.create(0, 2.3, 0)),
            scale: Vector3.create(0.6, 0.6, 0.6)
        })
        GltfContainer.createOrReplace(entity, { src: "models/npcs/Info.glb" })
    }
}