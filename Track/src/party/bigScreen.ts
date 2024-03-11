import { Entity, Material, MeshRenderer, PBMaterial_PbrMaterial, Transform, engine } from "@dcl/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math";

export class BigScreen {
    scale: Vector3
    entity: Entity

    constructor(_pos: Vector3, _rot: Quaternion, _scale: Vector3) {
        this.scale = Vector3.clone(_scale)

        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            position: _pos,
            rotation: _rot,
            scale: _scale
        })

        MeshRenderer.setPlane(this.entity)
        Material.setPbrMaterial(this.entity, this.getMaterial())
    }

    private getMaterial(): PBMaterial_PbrMaterial {
        return {
            albedoColor: Color4.Black()
        }
    }
}