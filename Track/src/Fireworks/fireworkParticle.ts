import { Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export class FireworkParticle {
    entity: Entity
    dead: boolean = false
    speed: number = 5
    decaySpeed: number = 0.2

    constructor() {
        this.entity = engine.addEntity()
        Transform.createOrReplace(this.entity)
        GltfContainer.createOrReplace(this.entity, { src: "models/fx/fireworkparticle.glb" })
    }

    spawn(_position: Vector3) {
        this.dead = false
        let randomSize: number = 0.1 + Math.random() / 5
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            //transform.position = Vector3.add(_position, Vector3.create(Math.random()/4,Math.random()/4,Math.random()/4))
            transform.position = _position
            transform.scale = Vector3.create(randomSize, randomSize, randomSize)
        }
    }

    die() {
        this.dead = true
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }

    update(_dt: number) {
        if (this.dead) return

        let transform = Transform.getMutableOrNull(this.entity)
        if (!transform) return

        let scale = transform.scale
        let position = transform.position
        let newScale = scale.x - _dt * this.decaySpeed
        if (newScale < 0) {
            this.die()
        }
        transform.scale = Vector3.create(newScale, newScale, newScale)
        transform.position = Vector3.create(position.x - _dt * (Math.random()), position.y - _dt * (Math.random() * 4), position.z - _dt * (Math.random()))
    }
}