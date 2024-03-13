/* imports */

import { Color3, DEG2RAD, Quaternion, Vector3 } from "@dcl/sdk/math";
import { Emitter } from "../entity/emitter"
import { EmitterPattern } from "../enums/emitterEnum";
import { Utils } from "../helpers/utils";
import { SyncSystem } from "../../../dj";
import { Transform } from "@dcl/ecs";

export class EmitterSystem {
    time: number = 0
    // bpm: number = 60
    // beat: number = 0
    // beatStartTime: number = new Date().getTime()
    // beatTimer: number = 0
    // private onBeatHandlers: ((_isPrimary: boolean, _beat: number) => void )[] = []
    isBeat: boolean = false
    isPrimaryBeat: boolean = false
    kickBack: number = 0
    kickBackVelocity: number = 0
    kickBackSpring: number = 120
    kickBackDampener: number = 9
    // onBeat(_callback: (_isPrimary: boolean, _beat: number) => void):void{
    //     this.onBeatHandlers.push(_callback)
    // }

    update(_deltaTime: number): void {

        if (_deltaTime <= 0) {
            return
        }
        _deltaTime = Math.min(_deltaTime, 1 / 15)

        const dt = Math.min(1, _deltaTime)
        this.time += dt
        // let isBeat = false
        // let isPrimaryBeat = false
        // const sPerBeat = 60 / this.bpm
        // this.beatTimer = (new Date().getTime() - this.beatStartTime) / 1000
        // while (this.beatTimer - this.beat * sPerBeat >= sPerBeat) {
        //     isBeat = true
        //     this.beat++
        //     if (this.beat >= 4) {
        //         this.beatStartTime += sPerBeat * 4 * 1000
        //         this.beatTimer -= sPerBeat * 4
        //         isPrimaryBeat = true
        //         this.beat = 0
        //     }
        //     this.kickBackVelocity += isPrimaryBeat ? 5 : 2
        //     if (this.onBeatHandlers !== undefined && this.onBeatHandlers !== null) {
        //         for(let handler of this.onBeatHandlers){
        //             if(handler !== undefined && handler !== null){
        //                 handler(isPrimaryBeat, this.beat)
        //             }
        //         }
        //     }
        // }
        if (this.isBeat) {
            this.kickBackVelocity += this.isPrimaryBeat ? 5 : 2
        }
        let kickBackAcc = (0 - this.kickBack) * this.kickBackSpring * dt
        let kickBackDec = this.kickBackVelocity * this.kickBackDampener * dt
        this.kickBackVelocity += kickBackAcc - kickBackDec
        this.kickBack += this.kickBackVelocity * dt
        let emitterIndex = 0;

        for (let emitter of Emitter.instances) {
            const oldFade: number = emitter.fade
            emitter.patternTime = (new Date().getTime() - emitter.patternStart) / 1000
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.off)) {
                emitter.fade = Math.max(0, emitter.fade - dt / emitter.fadeDuration)
            }
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.on)) {
                emitter.fade = Math.min(1, emitter.fade + dt / emitter.fadeDuration)
                let beamIndex: number = 0
                for (let beam of emitter.beams) {
                    const ratio = beamIndex / Emitter.BEAM_COUNT
                    beam.angleAroundEmitter += ratio * 360
                    beam.rotation = Vector3.add(beam.rotation, Vector3.create(0, 5, 0))
                    beamIndex++
                }
            }
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.burst)) {
                let pt = (Math.PI / 2) * emitter.patternTime / (SyncSystem.getInstance().getBPM() / 60) - emitter.timeOffset
                if (pt < 0) {
                    emitter.fade = 0
                }
                else {
                    pt = Math.max(0, Math.min(pt, Math.PI / 2))
                    if (this.isPrimaryBeat) {
                        emitter.patternTime = 0
                        emitter.patternStart = new Date().getTime()
                        pt = 0
                    }
                    let ptRatio = Math.sin(pt)
                    emitter.fade = 1 - Math.pow(ptRatio, 4)
                    emitter.pulseStrength = 25
                    emitter.pulseDuration = 1
                    emitter.pulseTime = Math.pow(1 - ptRatio, 3)
                    let beamIndex: number = 0
                    for (let beam of emitter.beams) {
                        const ratio = beamIndex / Emitter.BEAM_COUNT
                        beam.angleAroundEmitter += ratio * 360
                        beam.rotation = Vector3.add(beam.rotation, Vector3.create(0, ptRatio * 60, 0))
                        beamIndex++
                    }
                }
            }
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.inAndOut)) {
                emitter.fade = Math.min(1, emitter.fade + dt / emitter.fadeDuration)
                let beamIndex: number = 0
                for (let beam of emitter.beams) {
                    const ratio = beamIndex / Emitter.BEAM_COUNT
                    beam.angleAroundEmitter += ratio * 360
                    beam.rotation = Vector3.add(beam.rotation, Vector3.create(0, Math.cos(emitter.patternTime - emitter.timeOffset) * 30, 0))
                    beamIndex++
                }
            }
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.random)) {
                emitter.fade = Math.min(1, emitter.fade + dt / emitter.fadeDuration)
                let index: number = 0
                for (let beam of emitter.beams) {
                    const ratio = index / Emitter.BEAM_COUNT
                    beam.angleAroundEmitter += ratio * 360 + emitterIndex * 35
                    beam.rotation = Vector3.add(beam.rotation, Vector3.create(0, Math.cos((emitter.patternTime - emitter.timeOffset) * (ratio + 0.5) * 2 + index * 3) * 30, 0))
                    index++
                }
            }
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.search)) {
                emitter.fade = Math.min(1, emitter.fade + dt / emitter.fadeDuration)
                let beamIndex: number = 0
                for (let beam of emitter.beams) {
                    const ratio = beamIndex / Emitter.BEAM_COUNT
                    beam.angleAroundEmitter += ratio * 360
                    beam.rotation = Vector3.add(beam.rotation, Vector3.create(0, Math.cos((emitter.patternTime - emitter.timeOffset) + beamIndex * 3) * 30, 0))
                    beamIndex++
                }
            }
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.spin)) {
                let beamIndex: number = 0
                for (let beam of emitter.beams) {
                    const ratio = beamIndex / Emitter.BEAM_COUNT
                    beam.angleAroundEmitter = ratio * 360 + (emitter.patternTime - emitter.timeOffset) * 100
                    beamIndex++
                }
            }
            if (Utils.hasFlag(emitter.getPattern(), EmitterPattern.flicker)) {
                if (Math.sin((emitter.patternTime - emitter.timeOffset) * SyncSystem.getInstance().getMSPerBeat() / 1000 * Math.PI * 16) > -0.2) {
                    emitter.fade = 1
                }
                else {
                    emitter.fade = 0
                }
            }
            let localFade: number = emitter.fade
            if (localFade > oldFade) {
                localFade = 1 - Math.pow(1 - localFade, 2)
            }
            else {
                localFade = Math.pow(localFade, 3)
            }
            for (let beam of emitter.beams) {
                let beamTransform = Transform.getMutableOrNull(beam.entity)
                if (beamTransform === undefined || beamTransform === null) continue

                beamTransform.scale = Vector3.create(Emitter.BEAM_WIDTH * localFade, Emitter.BEAM_WIDTH * localFade, beam.length * localFade)
                beamTransform.rotation = Quaternion.multiply(Quaternion.fromEulerDegrees(0, 0, beam.angleAroundEmitter), Quaternion.fromEulerDegrees(beam.rotation.x, beam.rotation.y, beam.rotation.z + this.time * 10))
                beam.rotation = Vector3.Zero()
                let forwardDirection: Vector3 = Utils.getForwardVectorQ(beamTransform.rotation)
                let position = Vector3.Zero()
                position.x = Math.cos(beam.angleAroundEmitter * DEG2RAD) * Emitter.BEAM_SPREAD
                position.y = Math.sin(beam.angleAroundEmitter * DEG2RAD) * Emitter.BEAM_SPREAD
                position = Vector3.add(position, Vector3.scale(forwardDirection, beam.length / 2 * localFade))
                position.z += 0.1
                beamTransform.position = position
                beam.angleAroundEmitter = 0
            }

            let rDiff = emitter.targetColor.r - emitter.material.emissiveColor.r
            let gDiff = emitter.targetColor.g - emitter.material.emissiveColor.g
            let bDiff = emitter.targetColor.b - emitter.material.emissiveColor.b
            rDiff = Utils.getSign(rDiff) * Math.min(Math.abs(rDiff), dt / emitter.colorBlendDuration)
            gDiff = Utils.getSign(gDiff) * Math.min(Math.abs(gDiff), dt / emitter.colorBlendDuration)
            bDiff = Utils.getSign(bDiff) * Math.min(Math.abs(bDiff), dt / emitter.colorBlendDuration)
            emitter.material.emissiveColor = Color3.create(emitter.material.emissiveColor.r + rDiff, emitter.material.emissiveColor.g + gDiff, emitter.material.emissiveColor.b + bDiff)


            emitter.pulseTime = Math.max(0, emitter.pulseTime - dt)
            let pulseRatio: number = 1 - Math.pow(1 - emitter.pulseTime / emitter.pulseDuration, 3)
            emitter.material.emissiveIntensity = (5 + emitter.pulseStrength * pulseRatio) * Emitter.EMISSIVE_MULTIPLIER

            let emitterTransform = Transform.getMutableOrNull(emitter.entity)
            if (emitterTransform) {
                const emitterForward = Utils.getForwardVectorQ(emitterTransform.rotation)
                if (!emitter.useKickback) {
                    this.kickBack = 0
                    this.kickBackVelocity = 0
                }
                emitterTransform.position = Vector3.add(emitter.position, Vector3.scale(emitterForward, (-this.kickBack * emitter.fade)))
                if (emitter.useBob) {
                    emitterTransform.position.y += Math.sin(this.time * 2 + emitterIndex) * 0.04
                    emitterTransform.rotation = Quaternion.multiply(Quaternion.fromEulerDegrees(Math.sin(this.time * 2 + emitterIndex + 1) * -5, 0, 0), emitter.rotation)
                }
                else {
                    emitterTransform.rotation = Quaternion.create(emitter.rotation.x, emitter.rotation.y, emitter.rotation.z, emitter.rotation.w)
                }
            }

            emitter.updateMaterial()

            // next emitter
            emitterIndex++
        }

        this.isBeat = false
        this.isPrimaryBeat = false
    }
}