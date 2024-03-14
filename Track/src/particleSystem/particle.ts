import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { Car } from "@vegascity/racetrack/src/car";

export class Particle {
    entity: Entity
    dead: boolean = true
    size: number = 0
    originalY: number

    constructor(_position: Vector3) {
        this.entity = engine.addEntity()

        GltfContainer.createOrReplace(this.entity, { src: "models/fx/smokeball.glb" })
        Transform.createOrReplace(this.entity, { scale: Vector3.Zero() })

        this.spawn(_position)
    }

    spawn(_position: Vector3) {
        let activeCar = Car.getActiveCar()
        if(!activeCar) return

        if (activeCar.data.speed <= 7) return

        let transform = Transform.getMutableOrNull(this.entity)
        if (!transform) return

        this.dead = false
        if (!activeCar.data.isDrifting) {
            this.size = Math.abs(activeCar.data.speed) / 325
        } else {
            this.size = Math.abs(activeCar.data.speed) / 120
        }
        transform.position = _position
        transform.scale = Vector3.create(this.size, this.size, this.size)

        let base = activeCar.data.carEntity

        if (base) {
            let baseTransform = Transform.getMutableOrNull(base)
            if (baseTransform) {
                this.originalY = Quaternion.toEulerAngles(baseTransform.rotation).y
            }
        }

        transform.rotation = Quaternion.fromEulerDegrees(Math.random() * 360, Math.random() * 360, Math.random() * 360)
    }

    die() {
        this.dead = true
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }

    update(_dt: number) {
        if (this.dead) {
            return
        }
        this.size -= _dt / 2
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.create(this.size, this.size, this.size)
            transform.position = Vector3.create(transform.position.x, transform.position.y + _dt * 2, transform.position.z)
        }

        if (this.size <= 0) {
            this.die()
        }
    }
} 