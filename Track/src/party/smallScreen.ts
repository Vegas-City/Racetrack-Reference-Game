import { Entity, Material, MeshRenderer, PBMaterial_PbrMaterial, Transform, engine } from "@dcl/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math";

export class SmallScreen {
    scale: Vector3
    entity: Entity

    constructor(_pos: Vector3, _rot: Quaternion, _scale: Vector3) {
        this.scale = Vector3.clone(_scale)

        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            position: _pos,
            rotation: Quaternion.multiply(_rot, Quaternion.fromEulerDegrees(0, 180, 0)),
            scale: _scale
        })

        MeshRenderer.setPlane(this.entity)
        Material.setPbrMaterial(this.entity, this.getOffMaterial())
    }

    prepareForPartyStart(): void {
        Material.setPbrMaterial(this.entity, this.getPartyStartsMaterial())
    }

    prepareForRaceEnd(): void {
        Material.setPbrMaterial(this.entity, this.getRaceEndsMaterial())
    }

    triggerWaiting(): void {
        Material.setPbrMaterial(this.entity, this.getWaitingMaterial())
    }

    triggerCongrats(): void {
        Material.setPbrMaterial(this.entity, this.getCongratsMaterial())
    }

    private getOffMaterial(): PBMaterial_PbrMaterial {
        return {
            albedoColor: Color4.Black()
        }
    }

    private getPartyStartsMaterial(): PBMaterial_PbrMaterial {
        return {
            texture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_01_partyStartsIn.png",
            }),
            emissiveTexture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_01_partyStartsIn.png",
            }),
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        }
    }

    private getRaceEndsMaterial(): PBMaterial_PbrMaterial {
        return {
            texture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_02_raceEndsIn.png",
            }),
            emissiveTexture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_02_raceEndsIn.png",
            }),
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        }
    }

    private getWaitingMaterial(): PBMaterial_PbrMaterial {
        return {
            texture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_04_winnersWillBeAnn.png",
            }),
            emissiveTexture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_04_winnersWillBeAnn.png",
            }),
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        }
    }

    private getCongratsMaterial(): PBMaterial_PbrMaterial {
        return {
            texture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_03_congrats.png",
            }),
            emissiveTexture: Material.Texture.Common({
                src: "images/ui/screens/screenLittle_03_congrats.png",
            }),
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        }
    }
}