import { Entity, GltfContainer, InputAction, Material, MaterialTransparencyMode, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, Transform, engine, inputSystem } from "@dcl/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math";

export type CarSpecsConfig = {
    parent: Entity
    position: Vector3
    rotation: Quaternion
    scale: Vector3
    src: string
    srcLock?: string
    srcTooltip?: string
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
    tooltip?: Entity
    locked: boolean = false

    constructor(_config: CarSpecsConfig) {
        this.parentEntity = engine.addEntity()
        Transform.createOrReplace(this.parentEntity, {
            parent: _config.parent,
            position: _config.position
        })

        this.buttonEntity = engine.addEntity()
        Transform.createOrReplace(this.buttonEntity, {
            parent: _config.parent,
            position: _config.position,
            rotation: _config.rotation,
            scale: _config.scale
        })
        if (CarSpecsButton.SHOW_BUTTON_MESH) MeshRenderer.setBox(this.buttonEntity)
        MeshCollider.setBox(this.buttonEntity)
        PointerEvents.createOrReplace(this.buttonEntity, {
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
        Transform.createOrReplace(this.entity, {
            parent: this.parentEntity,
        })
        GltfContainer.createOrReplace(this.entity, { src: _config.src })

        if (_config.srcLock) {
            this.lockIcon = engine.addEntity()
            Transform.createOrReplace(this.lockIcon, {
                parent: this.parentEntity,
                scale: Vector3.Zero()
            })
            GltfContainer.createOrReplace(this.lockIcon, { src: _config.srcLock })
        }

        if (_config.srcTooltip) {
            this.tooltip = engine.addEntity()
            Transform.createOrReplace(this.tooltip, {
                parent: this.parentEntity,
                position: Vector3.create(-2, 0, 0.1),
                rotation: Quaternion.fromEulerDegrees(0, 180, 0),
                scale: Vector3.Zero()
            })
            MeshRenderer.setPlane(this.tooltip)
            Material.setPbrMaterial(this.tooltip, {
                texture: Material.Texture.Common({
                    src: _config.srcTooltip
                }),
                alphaTexture: Material.Texture.Common({
                    src: _config.srcTooltip
                }),
                emissiveTexture: Material.Texture.Common({
                    src: _config.srcTooltip
                }),
                transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
                emissiveColor: Color4.White(),
                emissiveIntensity: 1
            })
        }

        if (_config.startLocked) {
            this.lock()
        }

        engine.addSystem((dt: number) => {
            if (this.locked) {
                this.isScalingUp = false
            }

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER, this.buttonEntity)) {
                if (this.locked) {
                    if (this.tooltip) {
                        let tooltipTransform = Transform.getMutableOrNull(this.tooltip)
                        if (tooltipTransform) {
                            tooltipTransform.scale = Vector3.create(2.5, 2.5, 2.5)
                        }
                    }
                }
                else {
                    this.isScalingUp = true
                }
            }

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE, this.buttonEntity)) {
                if (this.locked) {
                    if (this.tooltip) {
                        let tooltipTransform = Transform.getMutableOrNull(this.tooltip)
                        if (tooltipTransform) {
                            tooltipTransform.scale = Vector3.Zero()
                        }
                    }
                }
                else {
                    this.isScalingUp = false
                }
            }

            let parentTransform = Transform.getMutableOrNull(this.parentEntity)
            if (parentTransform) {
                let currentScale = parentTransform.scale.x - 1
                if (this.isScalingUp) {
                    let newScale = 1 + Math.min(0.2, (currentScale + this.animSpeed * dt))
                    parentTransform.scale = Vector3.create(newScale, newScale, newScale)
                }
                else {
                    let newScale = 1 + Math.max(0, (currentScale - this.animSpeed * dt))
                    parentTransform.scale = Vector3.create(newScale, newScale, newScale)
                }
            }
        })
    }

    lock(): void {
        if (this.locked) return

        this.locked = true
        if (this.lockIcon) {
            let transform = Transform.getMutableOrNull(this.lockIcon)
            if (transform) {
                transform.scale = Vector3.One()
            }
        }
    }

    unlock(): void {
        if (!this.locked) return

        this.locked = false
        if (this.lockIcon) {
            let transform = Transform.getMutableOrNull(this.lockIcon)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }
    }
}