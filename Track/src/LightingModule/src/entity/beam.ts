import { Entity, Material, MeshRenderer, Transform, engine } from "@dcl/ecs";
import { Emitter } from "./emitter";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import { MaterialConfig } from "../types/materialConfig";

export class Beam {
    entity: Entity
    renderer: Entity

    length: number = 30 //18
    angleAroundEmitter: number = 0
    rotation: Vector3 = Vector3.Zero()

    constructor(_parentEmitter: Emitter) {
        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            parent: _parentEmitter.entity,
            scale: Vector3.Zero()
        })

        this.renderer = engine.addEntity()
        Transform.create(this.renderer, {
            parent: this.entity,
            rotation: Quaternion.fromEulerDegrees(90, 0, 0)
        })

        MeshRenderer.setPlane(this.renderer)
        this.updateMaterial(_parentEmitter.material)
    }

    updateMaterial(_material: MaterialConfig): void {
        Material.setPbrMaterial(this.renderer, {
            emissiveColor: _material.emissiveColor,
            emissiveIntensity: _material.emissiveIntensity,
            roughness: _material.roughness,
            metallic: _material.metallic,
            castShadows: _material.castShadows,
            transparencyMode: _material.transparencyMode,
            alphaTexture: Material.Texture.Common({
                src: _material.alphaTexture
            }),
            emissiveTexture: Material.Texture.Common({
                src: _material.emissiveTexture
            })
        })
    }
}