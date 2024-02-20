import { AvatarModifierArea, AvatarModifierType, Entity, Material, MeshRenderer, Transform, engine } from "@dcl/ecs";
import { Color4, Vector3 } from "@dcl/sdk/math";
import { MessageBus } from '@dcl/sdk/message-bus'
import { UserData } from "./Server/Helper";
import { Car } from "@vegascity/racetrack/src/car";

export class AvatarVisibilityManager {
    private static readonly DEBUG_MODE: boolean = false
    private static readonly UPDATE_FREQUENCY: number = 10

    private static messageBus = new MessageBus()
    private static entities: Entity[] = []
    private static sizes: Vector3[] = []
    private static elapsed: number = 0
    private static excludeIds: string[] = []
    private static insideCar: boolean = false

    constructor() {
        AvatarVisibilityManager.addArea(Vector3.create(56, 4, 40), Vector3.create(176, 8, 48))
        AvatarVisibilityManager.addArea(Vector3.create(56, 4, 144), Vector3.create(176, 8, 32))
        AvatarVisibilityManager.addArea(Vector3.create(0, 4, 96), Vector3.create(64, 8, 64))
        AvatarVisibilityManager.addArea(Vector3.create(120, 4, 96), Vector3.create(48, 8, 64))
        AvatarVisibilityManager.addArea(Vector3.create(56, 4, 8), Vector3.create(80, 8, 16))

        engine.addSystem(AvatarVisibilityManager.update)

        AvatarVisibilityManager.messageBus.on('user_outside_car', (_info: { userId: string }) => {
            if(AvatarVisibilityManager.insideCar) return

            AvatarVisibilityManager.addExcludeId(_info.userId)
        })

        AvatarVisibilityManager.messageBus.on('user_inside_car', (_info: { userId: string }) => {
            if(AvatarVisibilityManager.insideCar) return

            AvatarVisibilityManager.removeExcludeId(_info.userId)
        })
    }

    private static addArea(_pos: Vector3, _size: Vector3): void {
        const entity = engine.addEntity()

        AvatarModifierArea.create(entity, {
            area: _size,
            modifiers: [AvatarModifierType.AMT_HIDE_AVATARS, AvatarModifierType.AMT_DISABLE_PASSPORTS],
            excludeIds: []
        })

        Transform.create(entity, {
            position: _pos,
            scale: _size,
        })

        if (AvatarVisibilityManager.DEBUG_MODE) {
            MeshRenderer.setBox(entity)
            Material.setPbrMaterial(entity, { albedoColor: Color4.create(0.5, 0.5, 0.5, 0.5) })
        }

        AvatarVisibilityManager.entities.push(entity)
        AvatarVisibilityManager.sizes.push(_size)
    }

    private static addExcludeId(_userId: string): void {
        if (AvatarVisibilityManager.excludeIds.indexOf(_userId) > -1) return
        AvatarVisibilityManager.excludeIds.push(_userId)

        AvatarVisibilityManager.updateVisibility()
    }

    private static removeExcludeId(_userId: string): void {
        let index = AvatarVisibilityManager.excludeIds.indexOf(_userId)
        if (index > -1) {
            AvatarVisibilityManager.excludeIds.splice(index, 1)
            AvatarVisibilityManager.updateVisibility()
        }
    }

    private static hideAll(): void {
        AvatarVisibilityManager.entities.forEach((entity, index) => {
            AvatarModifierArea.createOrReplace(entity, {
                area: AvatarVisibilityManager.sizes[index],
                modifiers: [AvatarModifierType.AMT_HIDE_AVATARS, AvatarModifierType.AMT_DISABLE_PASSPORTS],
                excludeIds: []
            })
        })
    }

    private static updateVisibility(): void {
        AvatarVisibilityManager.entities.forEach((entity, index) => {
            AvatarModifierArea.createOrReplace(entity, {
                area: AvatarVisibilityManager.sizes[index],
                modifiers: [AvatarModifierType.AMT_HIDE_AVATARS, AvatarModifierType.AMT_DISABLE_PASSPORTS],
                excludeIds: AvatarVisibilityManager.excludeIds
            })
        })
    }

    private static update(_dt: number): void {
        let inside = Car.instances.length > 0 && Car.instances[0].data?.occupied
        if (!AvatarVisibilityManager.insideCar && inside) {
            AvatarVisibilityManager.hideAll()
        }
        else if(AvatarVisibilityManager.insideCar && !inside) {
            AvatarVisibilityManager.updateVisibility()
        }

        AvatarVisibilityManager.insideCar = inside

        AvatarVisibilityManager.elapsed -= _dt
        if (AvatarVisibilityManager.elapsed <= 0) {
            AvatarVisibilityManager.elapsed = AvatarVisibilityManager.UPDATE_FREQUENCY
            if (UserData.cachedData?.publicKey && UserData.cachedData?.publicKey.length > 0) {
                AvatarVisibilityManager.messageBus.emit(AvatarVisibilityManager.insideCar ? 'user_inside_car' : 'user_outside_car', { userId: UserData.cachedData?.publicKey })
            }
        }
    }
}