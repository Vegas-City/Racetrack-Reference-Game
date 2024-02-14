import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/ecs";
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
    onSelectCallback?: Function
}

export class MenuButton {
    private static readonly SHOW_BUTTON_MESH: boolean = false

    buttonEntity: Entity
    entity: Entity
    entitySelected?: Entity

    lockIcon?: Entity
    whiteCup?: Entity
    goldCup?: Entity

    selected: boolean = false
    locked: boolean = false
    qualified: boolean = false

    onSelectCallback: Function = () => { }

    constructor(_config: MenuConfig) {
        if (_config.onSelectCallback) this.onSelectCallback = _config.onSelectCallback

        this.buttonEntity = engine.addEntity()
        Transform.create(this.buttonEntity, {
            parent: _config.parent,
            position: _config.position,
            rotation: _config.rotation,
            scale: _config.scale
        })
        if (MenuButton.SHOW_BUTTON_MESH) MeshRenderer.setBox(this.buttonEntity)
        MeshCollider.setBox(this.buttonEntity)

        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            parent: _config.parent,
        })
        GltfContainer.create(this.entity, { src: _config.src })

        if (_config.srcSelected) {
            this.entitySelected = engine.addEntity()
            Transform.create(this.entitySelected, {
                parent: _config.parent,
                scale: Vector3.Zero()
            })
            GltfContainer.create(this.entitySelected, { src: _config.srcSelected })
        }

        if (_config.srcLock) {
            this.lockIcon = engine.addEntity()
            Transform.create(this.lockIcon, {
                parent: _config.parent,
                scale: Vector3.Zero()
            })
            GltfContainer.create(this.lockIcon, { src: _config.srcLock })
        }

        if (_config.srcWhiteCup) {
            this.whiteCup = engine.addEntity()
            Transform.create(this.whiteCup, {
                parent: _config.parent,
                scale: Vector3.One()
            })
            GltfContainer.create(this.whiteCup, { src: _config.srcWhiteCup })
        }

        if (_config.srcGoldCup) {
            this.goldCup = engine.addEntity()
            Transform.create(this.goldCup, {
                parent: _config.parent,
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
            const self = this
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.buttonEntity,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: 'Select'
                    }
                },
                function () {
                    self.onSelectCallback()
                    self.toggleSelection()
                }
            )
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

        pointerEventsSystem.removeOnPointerDown(this.buttonEntity)
    }

    unlock(): void {
        if (!this.locked) return

        this.locked = false
        if (this.lockIcon) {
            Transform.getMutable(this.lockIcon).scale = Vector3.Zero()
        }
        if (this.whiteCup) {
            Transform.getMutable(this.whiteCup).scale = Vector3.One()
        }
        if (this.goldCup) {
            Transform.getMutable(this.goldCup).scale = Vector3.Zero()
        }

        const self = this
        pointerEventsSystem.onPointerDown(
            {
                entity: this.buttonEntity,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: 'Select'
                }
            },
            function () {
                self.onSelectCallback()
                self.toggleSelection()
            }
        )
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
        if(!this.entitySelected) return

        if (this.selected) {
            Transform.getMutable(this.entitySelected).scale = Vector3.One()
            Transform.getMutable(this.entity).scale = Vector3.Zero()
        }
        else {
            Transform.getMutable(this.entitySelected).scale = Vector3.Zero()
            Transform.getMutable(this.entity).scale = Vector3.One()
        }
    }
}