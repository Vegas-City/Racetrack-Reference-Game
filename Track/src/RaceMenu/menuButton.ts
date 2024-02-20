import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, Transform, engine, inputSystem, pointerEventsSystem } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";

export type MenuConfig = {
    parent: Entity
    position: Vector3
    rotation: Quaternion
    scale: Vector3

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

    deselectAllCallback: Function = () => { }
    onSelectCallback: Function = () => { }

    constructor(_config: MenuConfig) {
        if (_config.deselectAllCallback) this.deselectAllCallback = _config.deselectAllCallback
        if (_config.onSelectCallback) this.onSelectCallback = _config.onSelectCallback

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
                scale: Vector3.Zero()
            })
            GltfContainer.create(this.lockIcon, { src: _config.srcLock })
        }

        if (_config.srcWhiteCup) {
            this.whiteCup = engine.addEntity()
            Transform.create(this.whiteCup, {
                parent: this.parentEntity,
                scale: Vector3.One()
            })
            GltfContainer.create(this.whiteCup, { src: _config.srcWhiteCup })
        }

        if (_config.srcGoldCup) {
            this.goldCup = engine.addEntity()
            Transform.create(this.goldCup, {
                parent: this.parentEntity,
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

        if (!this.locked) {
            PointerEvents.create(this.buttonEntity, {
                pointerEvents: [
                    {
                        eventType: PointerEventType.PET_DOWN,
                        eventInfo: {
                            button: InputAction.IA_POINTER,
                            hoverText: 'Select',
                            maxDistance: 20
                        }
                    },
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
        }

        engine.addSystem((dt: number) => {
            if (this.locked) return

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
        Transform.getMutable(this.parentEntity).scale = Vector3.One()
    }

    hide(): void {
        Transform.getMutable(this.parentEntity).scale = Vector3.Zero()
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
            Transform.getMutable(this.lockIcon).scale = Vector3.One()
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = Vector3.Zero()
        }
        if (this.goldCup) {
            Transform.getMutable(this.goldCup).scale = Vector3.Zero()
        }
    }

    unlock(): void {
        if (!this.locked) return

        this.locked = false
        this.qualified = false
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.Zero()
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = Vector3.One()
        }
        if (this.goldCup) {
            Transform.getMutable(this.goldCup).scale = Vector3.Zero()
        }
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
            Transform.getMutable(this.goldCup).scale = Vector3.One()
        }
    }

    setUnqualified(): void {
        if (!this.qualified) return

        this.qualified = false
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.Zero()
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = Vector3.One()
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
}