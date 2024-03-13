import { Entity, InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import { Rocket } from "./rocket";
import { FireworkParticle } from "./fireworkParticle";
import { Explosion } from "./explosion";
import * as utils from '@dcl-sdk/utils'

export class FireWorkManager {

    static instance: FireWorkManager

    rockets: Rocket[] = []
    fireworkParticles: FireworkParticle[] = []
    explosions: Explosion[] = []

    launchPositions: Vector3[] = [
        Vector3.create(36.08, 4, 105.44),
        Vector3.create(49.10, 5, 71.06),
        Vector3.create(69.01, 5.5, 124.43),
        Vector3.create(42.51, 14, 103.50),
        Vector3.create(87.47, 16, 88.58)
    ]

    constructor() {
        FireWorkManager.instance = this

        engine.addSystem(this.update.bind(this))

        // Debug launch positions
        // this.launchPositions.forEach(pos => {
        //     let launcher: Entity = engine.addEntity()
        //     MeshRenderer.setBox(launcher)
        //     Transform.createOrReplace(launcher, {position:pos})
        // });
    }

    createFireworkParticle(_position) {
        let oldParticle: FireworkParticle = null

        this.fireworkParticles.forEach(particle => {
            if (oldParticle == null && particle.dead) {
                oldParticle = particle
            }
        });


        if (oldParticle != null) {
            oldParticle.spawn(_position)
        } else {
            let newParticle = new FireworkParticle()
            newParticle.spawn(_position)
            this.fireworkParticles.push(newParticle)
        }
    }

    createExplosion(_position) {
        let oldExplosion: Explosion = null

        this.explosions.forEach(explosion => {
            if (oldExplosion == null && explosion.dead) {
                oldExplosion = explosion
            }
        });


        if (oldExplosion != null) {
            oldExplosion.spawn(_position)
        } else {
            let newExplosion = new Explosion()
            newExplosion.spawn(_position)
            this.explosions.push(newExplosion)
        }
    }

    launchFireworks(_positionOveride: Vector3 = Vector3.Zero(), _fakeRocket: boolean = false) {

        let oldRocket: Rocket = null

        this.rockets.forEach(rocket => {
            if (oldRocket == null && rocket.dead) {
                oldRocket = rocket
            }
        });

        let launchPos: Vector3 = _positionOveride

        if (_positionOveride.x == 0) {
            launchPos = Vector3.create(95 + Math.random() * 2, 20, 86 + Math.random() * 2)
        }

        if (oldRocket != null) {
            oldRocket.spawn(launchPos, Quaternion.fromEulerDegrees(0, 0, 0), _fakeRocket)
        } else {
            let newRocket = new Rocket()
            newRocket.spawn(launchPos, Quaternion.fromEulerDegrees(0, 0, 0), _fakeRocket)
            this.rockets.push(newRocket)
        }
    }

    update(_dt: number) {
        this.rockets.forEach(rocket => {
            rocket.update(_dt)
        })

        this.explosions.forEach(explosion => {
            explosion.update(_dt)
        })

        this.fireworkParticles.forEach(particle => {
            particle.update(_dt)
        })
    }

    startDisplay() {
        FireWorkManager.instance.launchPositions.forEach((pos, index) => {
            for (let salvo: number = 0; salvo < 15; salvo++) {
                utils.timers.setTimeout(() => {
                    FireWorkManager.instance.launchFireworks(pos)
                }, (index * 100 + Math.random() * 500) + 4000 * salvo)
            }
        });
    }
}