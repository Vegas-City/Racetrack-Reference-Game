import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { FireWorkManager } from "./fireworkManager";
import * as utils from '@dcl-sdk/utils'
import { AudioManager } from "../audio/audioManager";

export class Rocket {
    entity: Entity
    parent: Entity
    dead: boolean = false
    life: number = 0
    speed: number = 0
    particleSpawnRate: number = 0
    currentSpawnRate: number = 0
    fakeRocket: boolean = false

    constructor() {
        this.parent = engine.addEntity()
        this.entity = engine.addEntity()
        Transform.createOrReplace(this.parent)
        Transform.createOrReplace(this.entity, { parent: this.parent })
        GltfContainer.createOrReplace(this.entity, { src: "models/fx/rocket.glb" })
    }

    spawn(_position: Vector3, _rotation: Vector3, _fakeRocket: boolean = false) {
        this.fakeRocket = _fakeRocket
        this.currentSpawnRate = 0

        let parentTransform = Transform.getMutableOrNull(this.parent)
        if (parentTransform) parentTransform.position = _position
        if (this.fakeRocket) {
            if (parentTransform) parentTransform.rotation = Quaternion.fromEulerDegrees(Math.random() * 360, Math.random() * 360, Math.random() * 360)
            this.life = 0.5 + Math.random() * 0.5
            this.speed = 0.4 + Math.random() / 3
            this.particleSpawnRate = 1 / 15
        } else {
            if (parentTransform) parentTransform.rotation = Quaternion.fromEulerDegrees(-20 + Math.random() * 40 - 90, 0, -20 + Math.random() * 40 - 90)
            this.life = 2 + Math.random() * 0.5
            this.speed = 0.5
            this.particleSpawnRate = 1 / 30
        }

        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.rotation = Quaternion.fromEulerDegrees(90, 0, 0)
        }

        this.show()
        this.dead = false

        AudioManager.playLaunchSounds(_position)
    }

    show() {
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.create(0.02, 0.05, 0.02)
        }
    }

    hide() {
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }

    die() {
        this.dead = true
        if (!this.fakeRocket) {
            let parentTransform = Transform.getMutableOrNull(this.parent)
            if (parentTransform) {
                let pos: Vector3 = parentTransform.position
                FireWorkManager.instance.createExplosion(pos)
                for (let i: number = 0; i < 19; i++) {
                    FireWorkManager.instance.launchFireworks(pos, true)
                }

                AudioManager.playBoomSounds(pos)
                utils.timers.setTimeout(() => {
                    AudioManager.playBoomSounds(pos)
                }, Math.random() * 300 + 200)

                // delayed crackle
                utils.timers.setTimeout(() => {
                    AudioManager.playCrackleSounds(pos)
                }, 500 + Math.random() * 1000)
            }
        }
        this.hide()
    }

    update(_dt: number) {
        if (this.dead) return

        let parentTransform = Transform.getMutableOrNull(this.parent)
        if (!parentTransform) return

        this.currentSpawnRate += _dt

        if (this.currentSpawnRate >= this.particleSpawnRate) {
            if (this.fakeRocket) {
                FireWorkManager.instance.createFireworkParticle(parentTransform.position)
            } else {
                FireWorkManager.instance.createFireworkParticle(parentTransform.position)
                FireWorkManager.instance.createFireworkParticle(parentTransform.position)
            }
            this.currentSpawnRate = 0
        }

        this.life -= _dt

        if (this.life <= 0) {
            this.die()
        }

        let lastPosition: Vector3 = parentTransform.position

        const forwardDir = Vector3.normalize(Vector3.rotate(Vector3.Forward(), parentTransform.rotation))
        const velocity = Vector3.create(forwardDir.x * this.speed, forwardDir.y * this.speed, forwardDir.z * this.speed)

        parentTransform.position = Vector3.create(lastPosition.x + velocity.x, lastPosition.y + velocity.y, lastPosition.z + velocity.z)
    }
}