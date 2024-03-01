import { Entity, GltfContainer, InputAction, Material, MaterialTransparencyMode, MeshRenderer, PointerEventType, PointerEvents, Transform, engine, inputSystem } from "@dcl/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math"
import { shopUI } from "../utils/ui-provider"
import Wearable from "../utils/interfaces/wearable"
import { getWearableData } from "./wearables"

export class ShopMenu {

    static items: ShopButton[]
    constructor() {
        ShopMenu.items = [new ShopButton(Vector3.create(98.85, 2.42, -9), "models/wearables/helmet_btn.glb", getWearableData("helmet")),
        new ShopButton(Vector3.create(98.85 - 2.49, 2.4, -9), "models/wearables/gloves_btn.glb", getWearableData("gloves")),
        new ShopButton(Vector3.create(98.85 - 2.49 * 2, 2.4, -9), "models/wearables/jacket_btn.glb", getWearableData("upperBody")),
        new ShopButton(Vector3.create(98.85 - 2.49 * 3, 2.4, -9), "models/wearables/pants_btn.glb", getWearableData("lowerBody")),
        new ShopButton(Vector3.create(98.85 - 2.49 * 4, 2.4, -9), "models/wearables/boots_btn.glb", getWearableData("boots"))]
    }
}

export class ShopButton {
    parentEntity: Entity
    nameEntity: Entity
    buyEntity: Entity
    lockEntity: Entity
    locked: boolean = true
    data: Wearable

    animSpeed: number = 1.2
    isScalingUp: boolean = false
    tooltip?: Entity

    constructor(_position: Vector3, _modelPath: string, data: Wearable) {
        this.parentEntity = engine.addEntity()
        Transform.create(this.parentEntity, {
            position: _position
        })

        this.nameEntity = engine.addEntity()
        this.buyEntity = engine.addEntity()
        this.lockEntity = engine.addEntity()
        this.data = data

        Transform.create(this.buyEntity, { position: Vector3.Zero(), rotation: Quaternion.fromEulerDegrees(0, 180, 0), parent: this.parentEntity })
        Transform.create(this.nameEntity, { position: Vector3.add(_position, Vector3.create(0, 0.25, 0)), rotation: Quaternion.fromEulerDegrees(0, 180, 0) })
        Transform.create(this.lockEntity, { position: Vector3.create(0, 0, -0.03), parent: this.buyEntity })
        GltfContainer.create(this.nameEntity, { src: _modelPath })
        GltfContainer.create(this.buyEntity, { src: "models/wearables/buy_btn.glb" })
        GltfContainer.create(this.lockEntity, { src: "models/wearables/lock.glb" })

        this.tooltip = engine.addEntity()
        Transform.create(this.tooltip, {
            parent: this.parentEntity,
            position: Vector3.create(-0.8, 0, 0.1),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.tooltip)
        Material.setPbrMaterial(this.tooltip, {
            texture: Material.Texture.Common({
                src: "images/ui/tooltips/wearableTooltip.png"
            }),
            alphaTexture: Material.Texture.Common({
                src: "images/ui/tooltips/wearableTooltip.png"
            }),
            emissiveTexture: Material.Texture.Common({
                src: "images/ui/tooltips/wearableTooltip.png"
            }),
            transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        })

        PointerEvents.create(this.buyEntity, {
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

        if (!this.locked) {
            this.addSelectPointerEvent()
        }

        engine.addSystem((dt: number) => {
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.buyEntity)) {
                shopUI.show(data)
            }

            if (this.locked) {
                this.isScalingUp = false
            }

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER, this.buyEntity)) {
                if (this.locked) {
                    if (this.tooltip) {
                        let tooltipTransform = Transform.getMutableOrNull(this.tooltip)
                        if (tooltipTransform) {
                            tooltipTransform.scale = Vector3.create(1, 1, 1)
                        }
                    }
                }
                else {
                    this.isScalingUp = true
                }
            }

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE, this.buyEntity)) {
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

    lock() {
        this.locked = true
        Transform.getMutable(this.lockEntity).scale = Vector3.One()

        this.removeSelectPointerEvent()
    }

    unlock(points: number) {
        if (points >= this.data.price) {
            this.locked = false
            Transform.getMutable(this.lockEntity).scale = Vector3.Zero()

            this.addAllPointerEvents()
        } else {
            this.lock()
        }
    }

    private addAllPointerEvents(): void {
        PointerEvents.createOrReplace(this.buyEntity, {
            pointerEvents: [
                {
                    eventType: PointerEventType.PET_HOVER_ENTER,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        showFeedback: false,
                        maxDistance: 10
                    }
                },
                {
                    eventType: PointerEventType.PET_HOVER_LEAVE,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        showFeedback: false,
                        maxDistance: 10
                    }
                }
            ]
        })

        if (!this.locked) {
            this.addSelectPointerEvent()
        }
    }

    private removeSelectPointerEvent(): void {
        let pointerEvents = PointerEvents.getMutable(this.buyEntity).pointerEvents
        if (pointerEvents.length < 3) return

        pointerEvents.splice(0, -1)
    }

    private addSelectPointerEvent(): void {
        let pointerEvents = PointerEvents.getMutable(this.buyEntity).pointerEvents
        if (pointerEvents.length > 2) return

        pointerEvents.push({
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
                button: InputAction.IA_POINTER,
                hoverText: 'BUY: ' + this.data.id,
                maxDistance: 10
            }
        })
    }
}