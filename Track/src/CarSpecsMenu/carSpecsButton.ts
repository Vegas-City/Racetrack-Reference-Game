import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, Transform, engine, inputSystem } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";

export type CarSpecsConfig = {
    parent: Entity
    position: Vector3
    rotation: Quaternion
    scale: Vector3
    src: string
    srcLock?: string
    startLocked?: boolean
}

export class CarSpecsButton {
    private static readonly SHOW_BUTTON_MESH: boolean = false

    animSpeed: number = 1.2
    isScalingUp: boolean = false

    entity: Entity
    parentEntity: Entity
    buttonEntity: Entity
    lockIcon?: Entity
    locked: boolean = false

    constructor(_config: CarSpecsConfig) {
        this.parentEntity = engine.addEntity()
        Transform.create(this.parentEntity, {
            parent: _config.parent,
            position: _config.position
        })

        this.buttonEntity = engine.addEntity()
        Transform.create(this.buttonEntity, {
            parent: _config.parent,
            position: _config.position,
            rotation: _config.rotation,
            scale: _config.scale
        })
        if (CarSpecsButton.SHOW_BUTTON_MESH) MeshRenderer.setBox(this.buttonEntity)
        MeshCollider.setBox(this.buttonEntity)
        PointerEvents.create(this.buttonEntity, {
            pointerEvents: [
                {
                    eventType: PointerEventType.PET_HOVER_ENTER,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        showFeedback: false,
                        maxDistance: 20
                    }
                },
                {
                    eventType: PointerEventType.PET_HOVER_LEAVE,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        showFeedback: false,
                        maxDistance: 20
                    }
                }
            ]
        })

        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            parent: this.parentEntity,
        })
        GltfContainer.create(this.entity, { src: _config.src })

        if (_config.srcLock) {
            this.lockIcon = engine.addEntity()
            Transform.create(this.lockIcon, {
                parent: this.parentEntity,
                scale: Vector3.Zero()
            })
            GltfContainer.create(this.lockIcon, { src: _config.srcLock })
        }

        if (_config.startLocked) {
            this.lock()
        }

        engine.addSystem((dt: number) => {
            if (!this.locked && inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER, this.buttonEntity)) {
                this.isScalingUp = true
            }

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE, this.buttonEntity)) {
                this.isScalingUp = false
            }

            let parentTransform = Transform.getMutable(this.parentEntity)
            let currentScale = parentTransform.scale.x - 1
            if (this.isScalingUp) {
                let newScale = 1 + Math.min(0.2, (currentScale + this.animSpeed * dt))
                parentTransform.scale = Vector3.create(newScale, newScale, newScale)
            }
            else {
                let newScale = 1 + Math.max(0, (currentScale - this.animSpeed * dt))
                parentTransform.scale = Vector3.create(newScale, newScale, newScale)
            }
        })
    }

    lock(): void {
        if (this.locked) return

        this.locked = true
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.One()
        }
    }

    unlock(): void {
        if (!this.locked) return

        this.locked = false
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.Zero()
        }
    }
}