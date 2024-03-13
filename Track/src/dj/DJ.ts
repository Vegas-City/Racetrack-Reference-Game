/* imports */

import { Animator, Entity, GltfContainer, MeshCollider, Transform, engine } from "@dcl/ecs"
import { AnimatorController } from "./AnimatorController"
import { SyncSystem } from "./SyncSystem"
import { TransformConfig } from "./TransformConfig"
import { Utils } from "./Utils"
import { Quaternion, Vector3 } from "@dcl/sdk/math"

/* entity definition */

export class DJ {

    /* constants */

    static readonly GLTF: string = "models/DJ_Animated.glb"

    /* static fields */

    static instances: DJ[] = []

    /* fields */

    entity: Entity
    animator: AnimatorController

    /* constructor */

    constructor(_config: TransformConfig) {

        this.entity = engine.addEntity()

        // initialise the transform
        Transform.createOrReplace(this.entity, {
            position: Utils.coalesce(_config.position, Vector3.Zero()),
            rotation: Utils.coalesce(_config.rotation, Quaternion.Identity()),
            scale: Utils.coalesce(_config.scale, Vector3.One())
        })
        GltfContainer.createOrReplace(this.entity, {
            src: DJ.GLTF
        })

        // create a child entity to act as a collider
        const collider = engine.addEntity()
        Transform.createOrReplace(collider, {
            parent: this.entity,
            position: Vector3.create(0.05, 0.875, 0.125),
            scale: Vector3.create(0.45, 1.75, 0.4)
        })
        MeshCollider.setBox(collider)

        DJ.instances.push(this)
    }

    initialiseAnimator() {
        Animator.createOrReplace(this.entity, {
            states: [
                {
                    clip: "Dance",
                    playing: true,
                    loop: true
                }
            ]
        })
        const dance = Animator.getClip(this.entity, "Dance")
        engine.addSystem((_deltaTime: number) => {
            const bpm: number = SyncSystem.getInstance().getBPM()
            // const beatDuration: number = 60 / bpm 
            // const animFrames: number = 528
            // const animFrameRate: number = 30
            // const animDuration: number = animFrames / animFrameRate
            // const animBeats: number = 16
            // const animBPM: number = 60 * animBeats / animDuration 
            dance.speed = bpm * (528 / 30) / 60 / 16 / 2
        })
        //this.animator = new AnimatorController(this.entity, 60)
        //this.animator
        //    .addState("DJ_RaisedHands", 1, 100, 2, 0, 0, 25)
        //    .addState("DJ_TurnTableLoop", 1, 100, 2, 0, 0, 0)
    }
}