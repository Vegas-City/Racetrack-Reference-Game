import { Entity, Material, MeshRenderer, PBMaterial_PbrMaterial, Transform, engine } from "@dcl/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math";

export class SmallScreen {
    scale: Vector3
    entity: Entity

    entityOff: Entity
    entityPartyStarts: Entity
    entityRaceEnds: Entity
    entityWaiting: Entity
    entityCongrats: Entity

    constructor(_pos: Vector3, _rot: Quaternion, _scale: Vector3) {
        this.scale = Vector3.clone(_scale)

        this.entity = engine.addEntity()
        Transform.createOrReplace(this.entity, {
            position: _pos,
            rotation: Quaternion.multiply(_rot, Quaternion.fromEulerDegrees(0, 180, 0)),
            scale: _scale
        })

        this.entityOff = engine.addEntity()
        Transform.createOrReplace(this.entityOff, {
            parent: this.entity,
            scale: Vector3.One()
        })
        MeshRenderer.setPlane(this.entityOff)
        Material.setPbrMaterial(this.entityOff, this.getOffMaterial())

        this.entityPartyStarts = engine.addEntity()
        Transform.createOrReplace(this.entityPartyStarts, {
            parent: this.entity,
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.entityPartyStarts)
        Material.setPbrMaterial(this.entityPartyStarts, this.getPartyStartsMaterial())

        this.entityRaceEnds = engine.addEntity()
        Transform.createOrReplace(this.entityRaceEnds, {
            parent: this.entity,
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.entityRaceEnds)
        Material.setPbrMaterial(this.entityRaceEnds, this.getRaceEndsMaterial())

        this.entityWaiting = engine.addEntity()
        Transform.createOrReplace(this.entityWaiting, {
            parent: this.entity,
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.entityWaiting)
        Material.setPbrMaterial(this.entityWaiting, this.getWaitingMaterial())

        this.entityCongrats = engine.addEntity()
        Transform.createOrReplace(this.entityCongrats, {
            parent: this.entity,
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.entityCongrats)
        Material.setPbrMaterial(this.entityCongrats, this.getCongratsMaterial())
    }

    prepareForPartyStart(): void {
        let transformOff = Transform.getMutableOrNull(this.entityOff)
        let transformPartyStarts = Transform.getMutableOrNull(this.entityPartyStarts)
        let transformRaceEnds = Transform.getMutableOrNull(this.entityRaceEnds)
        let transformWaiting = Transform.getMutableOrNull(this.entityWaiting)
        let transformCongrats = Transform.getMutableOrNull(this.entityCongrats)

        if (transformOff) transformOff.scale = Vector3.Zero()
        if (transformPartyStarts) transformPartyStarts.scale = Vector3.One()
        if (transformRaceEnds) transformRaceEnds.scale = Vector3.Zero()
        if (transformWaiting) transformWaiting.scale = Vector3.Zero()
        if (transformCongrats) transformCongrats.scale = Vector3.Zero()
    }

    prepareForRaceEnd(): void {
        let transformOff = Transform.getMutableOrNull(this.entityOff)
        let transformPartyStarts = Transform.getMutableOrNull(this.entityPartyStarts)
        let transformRaceEnds = Transform.getMutableOrNull(this.entityRaceEnds)
        let transformWaiting = Transform.getMutableOrNull(this.entityWaiting)
        let transformCongrats = Transform.getMutableOrNull(this.entityCongrats)

        if (transformOff) transformOff.scale = Vector3.Zero()
        if (transformPartyStarts) transformPartyStarts.scale = Vector3.Zero()
        if (transformRaceEnds) transformRaceEnds.scale = Vector3.One()
        if (transformWaiting) transformWaiting.scale = Vector3.Zero()
        if (transformCongrats) transformCongrats.scale = Vector3.Zero()
    }

    triggerWaiting(): void {
        let transformOff = Transform.getMutableOrNull(this.entityOff)
        let transformPartyStarts = Transform.getMutableOrNull(this.entityPartyStarts)
        let transformRaceEnds = Transform.getMutableOrNull(this.entityRaceEnds)
        let transformWaiting = Transform.getMutableOrNull(this.entityWaiting)
        let transformCongrats = Transform.getMutableOrNull(this.entityCongrats)

        if (transformOff) transformOff.scale = Vector3.Zero()
        if (transformPartyStarts) transformPartyStarts.scale = Vector3.Zero()
        if (transformRaceEnds) transformRaceEnds.scale = Vector3.Zero()
        if (transformWaiting) transformWaiting.scale = Vector3.One()
        if (transformCongrats) transformCongrats.scale = Vector3.Zero()
    }

    triggerCongrats(): void {
        let transformOff = Transform.getMutableOrNull(this.entityOff)
        let transformPartyStarts = Transform.getMutableOrNull(this.entityPartyStarts)
        let transformRaceEnds = Transform.getMutableOrNull(this.entityRaceEnds)
        let transformWaiting = Transform.getMutableOrNull(this.entityWaiting)
        let transformCongrats = Transform.getMutableOrNull(this.entityCongrats)

        if (transformOff) transformOff.scale = Vector3.Zero()
        if (transformPartyStarts) transformPartyStarts.scale = Vector3.Zero()
        if (transformRaceEnds) transformRaceEnds.scale = Vector3.Zero()
        if (transformWaiting) transformWaiting.scale = Vector3.Zero()
        if (transformCongrats) transformCongrats.scale = Vector3.One()
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