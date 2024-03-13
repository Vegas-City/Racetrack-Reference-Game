/* imports */

import { AnimatorSystem } from "./AnimatorSystem"
import { AudioStream } from "./AudioStream"
import { ControlPad } from "./ControlPad"
import { ControlPadIntensity } from "./ControlPad"
import { DJ } from "./DJ"
import { MixTable } from "./MixTable"
import { SetConfig } from "./SetConfig"
import { SyncSystem } from "./SyncSystem"
import { Utils } from "./Utils"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Transform, engine } from "@dcl/sdk/ecs"
import { MessageBus } from "@dcl/sdk/message-bus"
import * as utils from '@dcl-sdk/utils'

/* class definition */

export class Set {

    /* fields */

    // references
    audioStream: AudioStream
    dj: DJ
    mixTable: MixTable

    // config
    position: Vector3
    rotation: Quaternion
    scale: Vector3
    url: string
    volume: number
    showDJ: boolean

    iswhiteListed: boolean = false

    // state
    intensity: ControlPadIntensity
    bpmBeenSet: boolean = false

    // bus
    private messageBus = new MessageBus()
    private hasResetDJ = false
    private djBaseScale: Vector3 = null

    /* constructor */

    constructor(_config: SetConfig) {

        // parse the config
        this.position = Utils.coalesce(_config.position, Vector3.Zero())
        this.rotation = Utils.coalesce(_config.rotation, Quaternion.Identity())
        this.scale = Utils.coalesce(_config.scale, Vector3.One())
        this.url = Utils.coalesce(_config.url, null)
        this.volume = Utils.coalesce(_config.volume, 1)
        this.showDJ = Utils.coalesce(_config.showDJ, true)

        // initialise state
        this.intensity = "NORMAL"

        // initialise systems
        if (this.showDJ) {
            const animatorSystem = AnimatorSystem.getInstance()
            engine.addSystem(animatorSystem.update.bind(animatorSystem))
        }
        const syncSystem = SyncSystem.getInstance()
        engine.addSystem(syncSystem.update.bind(syncSystem))

        // initialise the audio
        if (this.url !== null) {
            this.audioStream = new AudioStream(this.url)
            this.audioStream
                .setLooping(false)
                .setVolume(this.volume)
                .play()
        }
        else {
            this.audioStream = null
            console.log("No URL defined for audio stream")
        }

        // initialise mixtable
        // this.mixTable = new MixTable({
        //     position: this.pointToSetSpace(Vector3.Zero()),
        //     rotation: this.rotationToSetSpace(Quaternion.Identity()),
        //     scale: this.scaleToSetSpace(Vector3.One())
        // })

        // initialise dj
        if (this.showDJ) {
            this.dj = new DJ({
                position: this.pointToSetSpace(Vector3.Zero()),
                rotation: this.rotationToSetSpace(Quaternion.Identity()),
                scale: this.scaleToSetSpace(Vector3.One())
            })

            let djTransform = Transform.getMutableOrNull(this.dj.entity)
            if (djTransform) {
                this.djBaseScale = Vector3.clone(djTransform.scale)
                djTransform.scale = Vector3.Zero()
            }
        }

        // hook into beat detection
        SyncSystem.getInstance().onBeat(((_target) => (_isPrimary: boolean, _beat: number) => _target.onBeat(_isPrimary, _beat))(this))

        this.messageBus.on("djSetBPM", (_value: any, _sender: string) => {
            this.bpmBeenSet = true
            SyncSystem.getInstance().setBPM(_value.bpm).setLastBeat(_value.timestamp, _value.beatNumber)
            if (this.dj !== undefined && this.dj !== null && !this.hasResetDJ) {
                this.hasResetDJ = true
                utils.timers.setTimeout(() => {
                    let djTransform = Transform.getMutableOrNull(this.dj.entity)
                    if (djTransform) {
                        djTransform.scale = this.djBaseScale
                    }
                    this.dj.initialiseAnimator()
                    if (this.dj.animator !== undefined && this.dj.animator !== null) {
                        this.dj.animator.loop("DJ_TurnTableLoop", false)
                        console.log("looping DJ_TurnTableLoop")
                    }
                    else {
                        console.log("unable to DJ_TurnTableLoop")
                    }
                }, 10000)
            }
        })

        if (this.showDJ) {
            utils.timers.setTimeout(() => {
                ((_target: Set) => {
                    return () => {
                        if (!_target.hasResetDJ) {
                            _target.hasResetDJ = true
                            utils.timers.setTimeout(() => {
                                let djTransform = Transform.getMutableOrNull(_target.dj.entity)
                                if (djTransform) {
                                    djTransform.scale = _target.djBaseScale
                                }
                                _target.dj.initialiseAnimator()
                                if (_target.dj.animator !== undefined && _target.dj.animator !== null) {
                                    _target.dj.animator.loop("DJ_TurnTableLoop", false)
                                    console.log("looping DJ_TurnTableLoop")
                                }
                                else {
                                    console.log("unable to loop DJ_TurnTableLoop")
                                }
                            }, 2000)
                        }
                    }
                })(this)
            }, 15000)
        }

        this.messageBus.on("djGetBPM", (_value: any, _sender: string) => {
            if (this.iswhiteListed && this.bpmBeenSet) {
                this.messageBus.emit("djSetBPM", { bpm: SyncSystem.getInstance().getBPM(), timestamp: new Date().getTime() })
            }
        })

        this.messageBus.on("armsOut", (_value: any, _sender: string) => {
            if (this.intensity === "OFF" || this.dj.animator === undefined || this.dj.animator === null) {
                return
            }
            if (this.dj !== undefined && this.dj !== null) {
                this.dj.animator.play("ArmsOut", true)
            }
        })

        this.messageBus.on("horns", (_value: any, _sender: string) => {
            if (this.intensity === "OFF" || this.dj.animator === undefined || this.dj.animator === null) {
                return
            }
            if (this.dj !== undefined && this.dj !== null) {
                this.dj.animator.play("Horns", true)
            }
        })

        this.messageBus.on("intensity", (_value: any, _sender: string) => {
            this.intensity = _value.intensity
        })

        utils.timers.setTimeout(() => {
            this.messageBus.emit("djGetBPM", { bpm: SyncSystem.getInstance().getBPM(), timestamp: new Date().getTime() })
        }, 1000)
    }

    /* methods */

    addControlPad() {
        this.iswhiteListed = true
        const controlPad = new ControlPad({
            position: this.pointToSetSpace(Vector3.create(0, -1.5, 6)),
            rotation: this.rotationToSetSpace(Quaternion.multiply(Quaternion.fromEulerDegrees(0, 90, 0), Quaternion.fromEulerDegrees(0, 0, 15))),
            scale: this.scaleToSetSpace(Vector3.create(0.25, 0.25, 0.25))
        })
        controlPad.onAction(
            ((_target) => {
                return (_action) => {
                    switch (_action) {
                        case "ARMS OUT": {
                            this.messageBus.emit("DJ_RaisedHand", null)
                        } break
                        case "HORNS": {
                            this.messageBus.emit("DJ_TurnTableLoop", null)
                        } break
                        default: {
                            console.log("Unsupported action = " + _action)
                        }
                    }
                }
            })(this)
        )
        controlPad.onIntensity(
            ((_target) => {
                return (_intensity) => {
                    _target.intensity = _intensity
                    this.messageBus.emit("intensity", { intensity: _intensity })
                }
            })(this)
        )
    }

    onBeat(_isPrimary: boolean, _beat: number): void {

        //console.log(_beat + (_isPrimary ? "!" : ""))
        if (this.dj === undefined || this.dj === null) {
            return
        }
        if (this.dj.animator === undefined || this.dj.animator === null) {
            //console.log("no animator!")
            return
        }

        //console.log(this.intensity)
        switch (this.intensity) {
            case "OFF": {

            } break
            case "NORMAL": {

                if (_isPrimary) {
                    this.dj.animator.loop("DJ_TurnTableLoop", true)
                }
            } break
            case "HIGH": {
                if (_isPrimary) {
                    this.dj.animator.loop(Math.random() < 0.5 ? "DJ_TurnTableLoop" : "DJ_RaisedHands", true)
                }
            } break
            default: {
                console.log("Unrecognised intensity = " + this.intensity)
            } break
        }
    }

    pointToSetSpace(_point: Vector3): Vector3 {
        return Vector3.add(this.position, Vector3.multiply(Utils.multiplyVectorByQuaternion(this.rotation, _point), this.scale))
    }

    rotationToSetSpace(_rotation: Quaternion): Quaternion {
        return Quaternion.multiply(_rotation, this.rotation)
    }

    scaleToSetSpace(_scale: Vector3): Vector3 {
        return Vector3.multiply(_scale, this.scale)
    }
}