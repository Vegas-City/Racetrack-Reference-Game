import { AnimatorState } from "./AnimatorState"
import { IAnimatorState } from "./IAnimatorState"
import { Animator, Entity } from "@dcl/ecs";

export class AnimatorController {

    /* fields */

    // references
    entity: Entity

    // config
    blendDuration: number
    frameRate: number
    states: IAnimatorState

    // runtime
    activeState: string | null

    /* constructor */

    constructor(_entity: Entity, _animationFrameRate: number) {

        this.entity = _entity

        // check if the entity has an Animator - if not, create one
        const animator = Animator.getMutableOrNull(this.entity)
        if (animator === undefined || animator === null) {
            Animator.createOrReplace(this.entity, {
                states: []
            })
        }

        // store provided values
        this.blendDuration = 0.25
        this.frameRate = _animationFrameRate

        // initialise the states
        this.states = {}
    }

    /* methods */

    addState(_name: string, _startFrame: number, _endFrame: number, _beats?: number, _leadFrames?: number, _tailFrames?: number, _offsetFrames?: number): AnimatorController {

        // grab the clip
        let clip = Animator.getClipOrNull(this.entity, _name)
        if (clip === undefined || clip === null) {
            clip = { clip: _name }
            Animator.getMutable(this.entity).states = Animator.getMutable(this.entity).states.concat(clip)
        }

        // stop and reset it
        clip.weight = 0
        clip.playing = false

        // disable looping (looping will need to be manually triggered to sync correctly)
        clip.loop = false

        // set up the new state
        if (this.states) {
            this.states[_name] = new AnimatorState(this.entity, _name, _startFrame, _endFrame, _beats, _leadFrames, _tailFrames, _offsetFrames)
        }

        // return self for chaining
        return this
    }

    hasPlayingState(): boolean {
        for (let s in this.states) {
            if (this.states[s].isPlaying) {
                return true
            }
        }
        return false
    }

    play(_name: string, _takePriority: boolean = false): void {

        // handle priorities
        if (!_takePriority) {
            if (this.activeState !== undefined && this.activeState !== null && this.activeState !== _name && this.states[this.activeState].isPlaying && !this.states[this.activeState].isLooping) {
                return
            }
        }

        this.activeState = _name
        //this.states[_name].weight = this.hasPlayingState() ? this.states[_name].weight : 1
        this.states[_name].isLooping = false
        this.states[_name].play()
    }

    loop(_name: string, _takePriority: boolean = false, _nativeLoop: boolean = false): void {

        // handle priorities
        if (!_takePriority) {
            if (this.activeState !== undefined && this.activeState !== null && this.activeState !== _name && this.states[this.activeState].isPlaying && !this.states[this.activeState].isLooping) {
                return
            }
        }

        if (this.states) {
            //this.states[_name].weight = this.hasPlayingState() ? this.states[_name].weight : 1
            this.states[_name].isLooping = true
            this.states[_name].loop()
            this.activeState = _name
        }
    }

    stop(_name: string): AnimatorController {
        if (this.activeState === _name) {
            this.activeState = null
        }
        this.states[_name].stop()
        return this
    }
}