import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, Transform, engine, inputSystem } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";

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

    startSelected?: boolean
    startLocked?: boolean
    deselectAllCallback?: Function
    onSelectCallback?: Function
}

export class MenuButton {
    private static readonly SHOW_BUTTON_MESH: boolean = false

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
        if (MenuButton.SHOW_BUTTON_MESH) MeshRenderer.setBox(this.buttonEntity)
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

        this.entityUnselected = engine.addEntity()
        Transform.create(this.entityUnselected, {
            parent: this.parentEntity,
        })
        GltfContainer.create(this.entityUnselected, { src: _config.src })

        if (_config.srcSelected) {
            this.entitySelected = engine.addEntity()
            Transform.create(this.entitySelected, {
                parent: this.parentEntity,
                scale: Vector3.Zero()
            })
            GltfContainer.create(this.entitySelected, { src: _config.srcSelected })
        }

        if (_config.srcLock) {
            this.lockIcon = engine.addEntity()
            Transform.create(this.lockIcon, {
                parent: this.parentEntity,
                position: this.iconOffset,
                scale: Vector3.Zero()
            })
            GltfContainer.create(this.lockIcon, { src: _config.srcLock })
        }

        if (_config.srcWhiteCup) {
            this.whiteCup = engine.addEntity()
            Transform.create(this.whiteCup, {
                parent: this.parentEntity,
                position: this.iconOffset,
                scale: this.iconScale
            })
            GltfContainer.create(this.whiteCup, { src: _config.srcWhiteCup })
        }

        if (_config.srcGoldCup) {
            this.goldCup = engine.addEntity()
            Transform.create(this.goldCup, {
                parent: this.parentEntity,
                position: this.iconOffset,
                scale: Vector3.Zero()
            })
            GltfContainer.create(this.goldCup, { src: _config.srcGoldCup })
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
            if (this.locked || this.hidden) return

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.buttonEntity)) {
                this.select()
            }

            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER, this.buttonEntity)) {
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

    show(): void {
        this.addAllPointerEvents()
        Transform.getMutable(this.parentEntity).scale = Vector3.One()
        this.hidden = false
    }

    hide(): void {
        this.removeAllPointerEvents()
        Transform.getMutable(this.parentEntity).scale = Vector3.Zero()
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
            Transform.getMutable(this.lockIcon).scale = this.iconScale
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = Vector3.Zero()
        }
        if (this.goldCup) {
            Transform.getMutable(this.goldCup).scale = Vector3.Zero()
        }

        this.removeAllPointerEvents()
    }

    unlock(): void {
        if (!this.locked) return

        this.locked = false
        this.qualified = false
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.Zero()
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = this.iconScale
        }
        if (this.goldCup) {
            Transform.getMutable(this.goldCup).scale = Vector3.Zero()
        }

        this.addAllPointerEvents()
    }

    setQualified(): void {
        if (this.qualified) return

        this.qualified = true
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.Zero()
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = Vector3.Zero()
        }
        if (this.goldCup) {
            Transform.getMutable(this.goldCup).scale = this.iconScale
        }
    }

    setUnqualified(): void {
        if (!this.qualified) return

        this.qualified = false
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.Zero()
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = this.iconScale
        }
        if (this.goldCup) {
            Transform.getMutable(this.goldCup).scale = Vector3.Zero()
        }
    }

    private toggleSelection(): void {
        this.selected = !this.selected
        if (!this.entitySelected) return

        if (this.selected) {
            Transform.getMutable(this.entitySelected).scale = Vector3.One()
            Transform.getMutable(this.entityUnselected).scale = Vector3.Zero()
        }
        else {
            Transform.getMutable(this.entitySelected).scale = Vector3.Zero()
            Transform.getMutable(this.entityUnselected).scale = Vector3.One()
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

    private removeAllPointerEvents(): void {
        PointerEvents.deleteFrom(this.buttonEntity)
    }

    private addSelectPointerEvent(): void {
        let pointerEvents = PointerEvents.getMutable(this.buttonEntity).pointerEvents
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

    private removeSelectPointerEvent(): void {
        let pointerEvents = PointerEvents.getMutable(this.buttonEntity).pointerEvents
        if (pointerEvents.length < 3) return

        pointerEvents.splice(0, -1)
    }
}