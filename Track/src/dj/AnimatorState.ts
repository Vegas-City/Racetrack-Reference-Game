/* imports */

import { Animator, Entity, PBAnimationState } from "@dcl/sdk/ecs"
import { Utils } from "./Utils"

/* class definition */

export class AnimatorState {

    /* fields */

    // references
    entity: Entity

    // config
    name: string
    startFrame: number
    endFrame: number
    beats: number
    leadFrames: number
    tailFrames: number
    offsetFrames: number

    // state
    isPlaying: boolean
    isLooping: boolean
    speed: number
    time: number
    weight: number

    /* constructor */

    constructor(_entity: Entity, _name: string, _startFrame: number, _endFrame: number, _beats?: number, _leadFrames?: number, _tailFrames?: number, _offsetFrames?: number) {

        // store the provided values
        this.entity = _entity
        this.name = _name
        this.startFrame = _startFrame
        this.endFrame = _endFrame
        this.beats = Utils.coalesce(_beats, 0)
        this.leadFrames = Utils.coalesce(_leadFrames, 0)
        this.tailFrames = Utils.coalesce(_tailFrames, 0)
        this.offsetFrames = Utils.coalesce(_offsetFrames, 0)

        // initialise state
        this.isPlaying = false
        this.isLooping = false
        this.speed = 1
        this.time = 0
        this.weight = 0
    }

    /* methods */

    loop(): AnimatorState {
        const clip = this.getClip()
        clip.speed = this.speed
        if (!this.isPlaying) {
            this.isPlaying = true
            this.time = 0
            clip.loop = true
            clip.weight = 1
        }
        Animator.playSingleAnimation(this.entity, this.name, true)
        return this
    }

    play(): AnimatorState {
        const clip = this.getClip()
        clip.loop = false
        if (!this.isPlaying) {
            this.isPlaying = true
            this.time = 0
            clip.speed = this.speed
            Animator.playSingleAnimation(this.entity, this.name, true)
        }
        return this
    }

    stop(): AnimatorState {
        const clip = this.getClip()
        clip.loop = false
        if (this.isPlaying) {
            this.isPlaying = false
            clip.playing = false
        }
        return this
    }

    getClip(): PBAnimationState {
        return Animator.getClip(this.entity, this.name)
    }
}