import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class DJ {
    entity: Entity

    constructor() {
        this.entity = engine.addEntity()
        Transform.createOrReplace(this.entity, { position: Vector3.create(82.25, 4, 90.3), rotation: Quaternion.fromEulerDegrees(0, -75, 0), scale: Vector3.Zero() })
        GltfContainer.createOrReplace(this.entity, { src: "models/npcs/dj.glb" })
    }

    show(): void {
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.create(1.5, 1.5, 1.5)
        }
    }

    hide() {
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }
} 