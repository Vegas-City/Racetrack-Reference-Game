/* imports */

import { Entity, GltfContainer, MeshCollider, Transform, engine } from "@dcl/ecs"
import { TransformConfig } from "./TransformConfig"
import { Utils } from "./Utils"
import { Quaternion, Vector3 } from "@dcl/sdk/math"

/* entity definition */

export class MixTable {

    /* constants */

    static readonly GLTF: string = "assets/models/DJ_Mixtable.glb"

    /* fields */

    entity: Entity

    /* constructor */

    constructor(_config: TransformConfig) {

        this.entity = engine.addEntity()

        // initialise the transform
        Transform.create(this.entity, {
            position: Utils.coalesce(_config.position, Vector3.Zero()),
            rotation: Utils.coalesce(_config.rotation, Quaternion.Identity()),
            scale: Utils.coalesce(_config.scale, Vector3.One())
        })

        // initialise the model
        GltfContainer.create(this.entity, {
            src: MixTable.GLTF
        })

        // create a child entity to act as a collider
        const collider = engine.addEntity()
        Transform.create(collider, {
            parent: this.entity,
            position: Vector3.create(-0.11, 0.465, 0.59),
            scale: Vector3.create(2.3, 0.93, 0.61)
        })
        MeshCollider.setBox(collider)
    }
}