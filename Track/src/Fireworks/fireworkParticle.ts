import { Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export class FireworkParticle {
    entity: Entity
    dead: boolean = false
    life: number = 0
    speed: number = 5

    constructor() {
        this.entity = engine.addEntity()
        Transform.create(this.entity)
        MeshRenderer.setSphere(this.entity)
    }

    spawn(_position: Vector3, _rotation: Vector3) {
        this.life = 1.5 + Math.random()
    }

    die() {
        this.dead = true
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