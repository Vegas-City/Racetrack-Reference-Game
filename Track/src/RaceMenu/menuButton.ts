import { Entity, GltfContainer, InputAction, Material, MaterialTransparencyMode, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, Transform, engine, inputSystem } from "@dcl/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math";

export type MenuConfig = {
    parent: Entity
    position: Vector3
    rotation: Quaternion
    scale: Vector3

    iconOffset?: Vector3
    iconScale?: Vector3

    src: string
    srcSelected?: string
    srcLock?: string
    srcWhiteCup?: string
    srcGoldCup?: string
    srcTooltip?: string

    startSelected?: boolean
    startLocked?: boolean
    deselectAllCallback?: Function
    onSelectCallback?: Function
}

export class MenuButton {
    private static readonly TOOLTIP_DEATH_TIME: number = 10

    animSpeed: number = 1.2
    isScalingUp: boolean = false

    iconOffset: Vector3 = Vector3.Zero()
    iconScale: Vector3 = Vector3.One()

    parentEntity: Entity
    buttonEntity: Entity

    entityUnselected: Entity
    entitySelected?: Entity

    lockIcon?: Entity
    whiteCup?: Entity
    goldCup?: Entity
    tooltip?: Entity
    tooltipHoverAlive: boolean = false
    tooltipAliveTime: number = 0

    selected: boolean = false
    locked: boolean = false
    qualified: boolean = false
    hidden: boolean = false

    deselectAllCallback: Function = () => { }
    onSelectCallback: Function = () => { }

    constructor(_config: MenuConfig) {
        if (_config.deselectAllCallback) this.deselectAllCallback = _config.deselectAllCallback
        if (_config.onSelectCallback) this.onSelectCallback = _config.onSelectCallback
        if (_config.iconOffset) this.iconOffset = _config.iconOffset
        if (_config.iconScale) this.iconScale = _config.iconScale

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

        this.entityUnselected = engine.addEntity()
        Transform.createOrReplace(this.entityUnselected, {
            parent: this.parentEntity,
        })
        GltfContainer.createOrReplace(this.entityUnselected, { src: _config.src })

        if (_config.srcSelected) {
            this.entitySelected = engine.addEntity()
            Transform.createOrReplace(this.entitySelected, {
                parent: this.parentEntity,
                scale: Vector3.Zero()
            })
            GltfContainer.createOrReplace(this.entitySelected, { src: _config.srcSelected })
        }

        if (_config.srcLock) {
            this.lockIcon = engine.addEntity()
            Transform.createOrReplace(this.lockIcon, {
                parent: this.parentEntity,
                position: this.iconOffset,
                scale: Vector3.Zero()
            })
            GltfContainer.createOrReplace(this.lockIcon, { src: _config.srcLock })
        }

        if (_config.srcWhiteCup) {
            this.whiteCup = engine.addEntity()
            Transform.createOrReplace(this.whiteCup, {
                parent: this.parentEntity,
                position: this.iconOffset,
                scale: this.iconScale
            })
            GltfContainer.createOrReplace(this.whiteCup, { src: _config.srcWhiteCup })
        }

        if (_config.srcGoldCup) {
            this.goldCup = engine.addEntity()
            Transform.createOrReplace(this.goldCup, {
                parent: this.parentEntity,
                position: this.iconOffset,
                scale: Vector3.Zero()
            })
            GltfContainer.createOrReplace(this.goldCup, { src: _config.srcGoldCup })
        }

        if (_config.srcTooltip) {
            this.tooltip = engine.addEntity()
            Transform.createOrReplace(this.tooltip, {
                parent: this.parentEntity,
                position: Vector3.create(-3, 0, 0.1),
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

        if (_config.startSelected) {
            this.toggleSelection()
        }

        if (_config.startLocked) {
            this.lock()
        }

        if (!this.locked && !this.hidden) {
            this.addSelectPointerEvent()
        }

        engine.addSystem((dt: number) => {
            if (this.hidden) return

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.buttonEntity)) {
                this.select()
            }

            if (this.locked) {
                this.isScalingUp = false
            }

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER, this.buttonEntity)) {
                if (this.locked) {
                    if (this.tooltip) {
                        this.tooltipHoverAlive = true
                        let tooltipTransform = Transform.getMutableOrNull(this.tooltip)
                        if (tooltipTransform) {
                            tooltipTransform.scale = Vector3.create(3.5, 3.5, 3.5)
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
                        this.tooltipHoverAlive = false
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

            if (this.tooltip) {
                // hide tooltip when unlocked
                if (this.locked == false) {
                    let tooltipTransform = Transform.getMutableOrNull(this.tooltip)
                    if (tooltipTransform) {
                        tooltipTransform.scale = Vector3.Zero()
                    }
                }

                // handle tooltip death
                if (this.tooltipHoverAlive) {
                    this.tooltipAliveTime += dt
                    if (this.tooltipAliveTime > MenuButton.TOOLTIP_DEATH_TIME) {
                        this.tooltipHoverAlive = false
                        this.tooltipAliveTime = 0
                        
                        let tooltipTransform = Transform.getMutableOrNull(this.tooltip)
                        if (tooltipTransform) {
                            tooltipTransform.scale = Vector3.Zero()
                        }
                    }
                }
                else {
                    this.tooltipAliveTime = 0
                }
            }
        })
    }

    show(): void {
        this.addAllPointerEvents()
        let parentTransform = Transform.getMutableOrNull(this.parentEntity)
        if (parentTransform) {
            parentTransform.scale = Vector3.One()
        }
        this.hidden = false
    }

    hide(): void {
        this.removeSelectPointerEvent()
        let parentTransform = Transform.getMutableOrNull(this.parentEntity)
        if (parentTransform) {
            parentTransform.scale = Vector3.Zero()
        }
        this.hidden = true
    }

    select(): void {
        if (!this.selected) {
            this.deselectAllCallback()
            this.toggleSelection()
            this.onSelectCallback()
        }
    }

    deselect(): void {
        if (this.selected) this.toggleSelection()
    }

    lock(): void {
        if (this.locked) return

        this.locked = true
        if (this.lockIcon) {
            let transform = Transform.getMutableOrNull(this.lockIcon)
            if (transform) {
                transform.scale = this.iconScale
            }
        }
        if (this.whiteCup) {
            let transform = Transform.getMutableOrNull(this.whiteCup)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }
        if (this.goldCup) {
            let transform = Transform.getMutableOrNull(this.goldCup)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }

        this.removeSelectPointerEvent()
    }

    unlock(): void {
        if (!this.locked) return

        this.locked = false
        this.qualified = false
        if (this.lockIcon) {
            let transform = Transform.getMutableOrNull(this.lockIcon)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }
        if (this.whiteCup) {
            let transform = Transform.getMutableOrNull(this.whiteCup)
            if (transform) {
                transform.scale = this.iconScale
            }
        }
        if (this.goldCup) {
            let transform = Transform.getMutableOrNull(this.goldCup)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }

        this.addAllPointerEvents()
    }

    setQualified(): void {
        if (this.qualified) return

        this.qualified = true
        if (this.lockIcon) {
            let transform = Transform.getMutableOrNull(this.lockIcon)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }
        if (this.whiteCup) {
            let transform = Transform.getMutableOrNull(this.whiteCup)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }
        if (this.goldCup) {
            let transform = Transform.getMutableOrNull(this.goldCup)
            if (transform) {
                transform.scale = this.iconScale
            }
        }
    }

    setUnqualified(): void {
        if (!this.qualified) return

        this.qualified = false
        if (this.lockIcon) {
            let transform = Transform.getMutableOrNull(this.lockIcon)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }
        if (this.whiteCup) {
            let transform = Transform.getMutableOrNull(this.whiteCup)
            if (transform) {
                transform.scale = this.iconScale
            }
        }
        if (this.goldCup) {
            let transform = Transform.getMutableOrNull(this.goldCup)
            if (transform) {
                transform.scale = Vector3.Zero()
            }
        }
    }

    private toggleSelection(): void {
        this.selected = !this.selected
        if (!this.entitySelected) return

        if (this.selected) {
            let transformSelected = Transform.getMutableOrNull(this.entitySelected)
            if (transformSelected) {
                transformSelected.scale = Vector3.One()
            }

            let transformUnselected = Transform.getMutableOrNull(this.entityUnselected)
            if (transformUnselected) {
                transformUnselected.scale = Vector3.Zero()
            }
        }
        else {
            let transformSelected = Transform.getMutableOrNull(this.entitySelected)
            if (transformSelected) {
                transformSelected.scale = Vector3.Zero()
            }

            let transformUnselected = Transform.getMutableOrNull(this.entityUnselected)
            if (transformUnselected) {
                transformUnselected.scale = Vector3.One()
            }
        }
    }

    private addAllPointerEvents(): void {
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

        if (!this.locked) {
            this.addSelectPointerEvent()
        }
    }

    private removeSelectPointerEvent(): void {
        let pointerEvents = PointerEvents.getMutableOrNull(this.buttonEntity)?.pointerEvents

        if (!pointerEvents) return
        if (pointerEvents.length < 3) return

        pointerEvents.splice(0, -1)
    }

    private addSelectPointerEvent(): void {
        let pointerEvents = PointerEvents.getMutableOrNull(this.buttonEntity)?.pointerEvents

        if (!pointerEvents) return
        if (pointerEvents.length > 2) return

        pointerEvents.push({
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
                button: InputAction.IA_POINTER,
                hoverText: 'Select',
                maxDistance: 20
            }
        })
    }
}