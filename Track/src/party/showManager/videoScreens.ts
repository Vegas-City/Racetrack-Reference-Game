import { Entity, Material, MeshRenderer, PBMaterial_PbrMaterial, Transform, engine } from '@dcl/sdk/ecs'
import { Color3, Color4, Vector3 } from '@dcl/sdk/math'

export abstract class VideoScreens {
    static S1: Entity

    static Initialise(_parent: Entity) {
        const videoMat: PBMaterial_PbrMaterial = {
            castShadows: false,
            metallic: 0,
            roughness: 1,
            emissiveIntensity: 1,
            emissiveColor: Color3.Black(),
            albedoColor: Color4.Black(),
            alphaTest: 1
        }

        // S1
        VideoScreens.S1 = engine.addEntity()
        MeshRenderer.setPlane(VideoScreens.S1)
        Transform.create(VideoScreens.S1, {
            parent: _parent,
            position: Vector3.create(0, 0, -0.01)
        })
        Material.setPbrMaterial(VideoScreens.S1, videoMat)
    }

    static Show(): void {
        let transform = Transform.getMutableOrNull(VideoScreens.S1)
        if (transform) {
            transform.scale = Vector3.One()
        }
    }

    static Hide(): void {
        let transform = Transform.getMutableOrNull(VideoScreens.S1)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }
}