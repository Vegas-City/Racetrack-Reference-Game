/* imports */

import { DJ } from "./DJ"
import { SyncSystem } from "./SyncSystem"

/* system definition */

export class AnimatorSystem {

    /* static fields */

    private static instance: AnimatorSystem

    /* fields */

    private lastBPM: number = -1

    /* static methods */

    static getInstance(): AnimatorSystem {
        if (AnimatorSystem.instance === undefined || AnimatorSystem.instance === null) {
            AnimatorSystem.instance = new AnimatorSystem()
        }
        return AnimatorSystem.instance
    }

    /* implementation of isystem */

    update(_deltaTime: number): void {

        if (_deltaTime <= 0) {
            return
        }
        _deltaTime = Math.min(_deltaTime, 1 / 15)

        // check for bpm change
        const syncSystem = SyncSystem.getInstance()
        const newBPM = syncSystem.getBPM()
        const hasBPMChanged = newBPM != this.lastBPM
        this.lastBPM = newBPM

        // iterate all DJ entities
        DJ.instances.forEach(dj => {
            // iterate all states
            let sumWeight = 0
            for (let s in dj.animator.states) {

                // grab the current state
                const state = dj.animator.states[s]
                const clip = state.getClip()

                // check if the bpm changed
                if (hasBPMChanged) {

                    // don't alter if not possible to beat sync
                    if (state.beats >= 1) {

                        // calculate the new speed for the animation based on the current tempo
                        const totalFrames = state.endFrame - state.startFrame
                        const syncableFrames = totalFrames - state.leadFrames - state.tailFrames
                        const durationInSeconds = syncableFrames / dj.animator.frameRate
                        const stateBPM = state.beats / (durationInSeconds / 60)
                        const multiplier = newBPM / stateBPM

                        // apply the new speed
                        state.speed = multiplier
                    }
                }

                // manage weight
                const duration = (state.endFrame - state.startFrame) / dj.animator.frameRate
                let targetWeight = 0
                if (dj.animator.activeState === state.name || dj.animator.activeState === null) {
                    if (state.isPlaying && (state.isLooping || state.time < duration - dj.animator.blendDuration)) {
                        targetWeight = 1
                    }
                }
                else if (state.isPlaying && (state.isLooping || state.time < duration - dj.animator.blendDuration)) { // if this state is playing...
                    const activeState = dj.animator.states[dj.animator.activeState]
                    const activeStateDuration = (activeState.endFrame - activeState.startFrame) / dj.animator.frameRate
                    if (!activeState.isLooping && activeState.time >= activeStateDuration - dj.animator.blendDuration) {
                        targetWeight = 1
                    }
                }
                if (dj.animator.blendDuration <= 0) {
                    state.weight = targetWeight
                }
                else {
                    state.weight += (targetWeight - state.weight) * _deltaTime / dj.animator.blendDuration
                }
                if (state.weight <= 0.001) {
                    state.weight = 0
                    if (state.isPlaying && !state.isLooping && !clip.loop) {
                        state.stop()
                    }
                }
                else if (state.weight >= 0.999) {
                    state.weight = 1
                }
                clip.weight = state.weight
                sumWeight += state.weight

                // track time
                if (state.isPlaying) {

                    state.time += _deltaTime * state.speed

                    if (state.time >= (state.endFrame - state.startFrame) / dj.animator.frameRate) {
                        if (state.isLooping) {
                            if (!clip.loop) {
                                dj.animator.stop(state.name).play(state.name)
                                state.isLooping = true
                                state.play()
                            }
                        }
                        else {
                            dj.animator.stop(state.name)
                        }
                    }
                }
            }

            if (sumWeight < 1) {
                //dj.animator.states["DJ_TurnTableLoop"].weight = 1 - sumWeight
                //dj.animator.states["DJ_TurnTableLoop"].getClip().weight = dj.animator.states["DJ_TurnTableLoop"].weight
            }
        })
    }
}