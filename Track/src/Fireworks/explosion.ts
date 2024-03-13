import { Quaternion, Vector3 } from "@dcl/ecs-math"
import { Animator, Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"

export class Explosion {
    entity: Entity
    dead: boolean = false
    life: number = 0

    constructor() {
        this.entity = engine.addEntity()
        Transform.createOrReplace(this.entity)
        Animator.createOrReplace(this.entity, {
            states: [
                {
                    clip: 'Animation',
                    playing: false,
                    loop: false,
                    speed: 1
                }
            ]
        })
    }

    spawn(_position: Vector3) {
        GltfContainer.createOrReplace(this.entity, { src: "models/fx/fireworkSmall.glb" })
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.create(4, 4, 4)
            transform.rotation = Quaternion.fromEulerDegrees(Math.random() * 20, Math.random() * 360, Math.random() * 20)
            transform.position = _position
        }
        this.life = 4
        Animator.playSingleAnimation(this.entity, "Animation", true)
        this.dead = false
    }

    die() {
        GltfContainer.deleteFrom(this.entity)
        this.dead = true
        Animator.stopAllAnimations(this.entity)
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }

    update(_dt: number) {
        if (this.dead) {
            return
        }

        this.life -= _dt

        if (this.life <= 0) {
            this.die()
        }
    }
}