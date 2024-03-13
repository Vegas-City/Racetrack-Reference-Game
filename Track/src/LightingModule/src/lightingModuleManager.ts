import { Emitter } from "./entity/emitter";
import { EmitterPattern } from "./enums/emitterEnum";
import { EmitterSystem } from "./system/emitterSystem";
import { Utils } from "./helpers/utils";
import { Color3, Quaternion, Vector3 } from "@dcl/sdk/math";
import { SyncSystem } from "../../dj";
import { engine } from "@dcl/sdk/ecs";

export class LightingModuleManager {

    canSetBPM: boolean = false
    emitterSystem: EmitterSystem

    constructor(_setBPMWalletWhiteList: string[]) {
        this.start()
    }

    private onBPMHandler: ((_value: number) => void)

    // onBPMChange(_callback:(value:number)=>void):void{
    //     this.onBPMHandler = _callback
    // }

    // onBeat(_callback:(_isPrimary: boolean, _beat: number)=> void):void{
    //     this.emitterSystem.onBeat(_callback)
    // }

    start() {
        const colorBank: Color3[] = []
        const patterns: EmitterPattern[] = [
            EmitterPattern.off,
            EmitterPattern.burst,
            EmitterPattern.burst | EmitterPattern.spin,
            EmitterPattern.burst,
            EmitterPattern.burst | EmitterPattern.spin,
            //EmitterPattern.burst | EmitterPattern.flicker | EmitterPattern.spin,
            //EmitterPattern.burst | EmitterPattern.flicker,
            EmitterPattern.inAndOut,
            EmitterPattern.inAndOut | EmitterPattern.spin,
            EmitterPattern.inAndOut,
            EmitterPattern.inAndOut | EmitterPattern.spin,
            EmitterPattern.inAndOut | EmitterPattern.flicker | EmitterPattern.spin,
            EmitterPattern.inAndOut | EmitterPattern.flicker,
            EmitterPattern.on,
            EmitterPattern.on | EmitterPattern.spin,
            EmitterPattern.on,
            EmitterPattern.on | EmitterPattern.spin,
            EmitterPattern.on | EmitterPattern.flicker,
            EmitterPattern.on | EmitterPattern.flicker | EmitterPattern.spin,
            EmitterPattern.random,
            EmitterPattern.random | EmitterPattern.spin,
            EmitterPattern.random,
            EmitterPattern.random | EmitterPattern.spin,
            EmitterPattern.random | EmitterPattern.flicker,
            EmitterPattern.random | EmitterPattern.flicker | EmitterPattern.spin,
            EmitterPattern.search,
            EmitterPattern.search | EmitterPattern.spin,
            EmitterPattern.search,
            EmitterPattern.search | EmitterPattern.spin,
            EmitterPattern.search | EmitterPattern.flicker | EmitterPattern.spin,
            EmitterPattern.search | EmitterPattern.flicker
        ]

        let currentPattern: EmitterPattern = null
        let currentTimeOffset: boolean = false
        let colorMode: number = 0 // 0 = set color on pattern change, 1 = alternating colours, 2 = moving gradient
        let colorOffset: number = 0
        this.emitterSystem = new EmitterSystem()
        // SyncSystem.getInstance().getBPM() = 110
        // this.emitterSystem.beat = 0
        // this.emitterSystem.beatTimer = 0

        // this.emitterSystem.onBeat((_isPrimary: boolean, _beat: number): void => {
        SyncSystem.getInstance().onBeat(
            ((_target: LightingModuleManager) => {
                return (_isPrimary: boolean, _beat: number): void => {
                    if (_target.emitterSystem !== undefined && _target.emitterSystem !== null) {
                        _target.emitterSystem.isBeat = true
                        _target.emitterSystem.isPrimaryBeat = _isPrimary
                    }
                    if (_isPrimary) {
                        colorMode = Math.floor(Math.random() * 3 - 0.0001)
                        colorOffset = Math.floor(Math.random() * colorBank.length - 0.0001)
                        let pattern = Math.random() > 0.5 ? Utils.getRandomItem(patterns) : null
                        console.log(pattern)
                        let setTimeOffset = Utils.hasFlag(pattern, EmitterPattern.burst) ? Math.random() < 0.75 : Math.random() < 0.25
                        if (Utils.hasFlag(currentPattern, EmitterPattern.burst)) {
                            if (currentTimeOffset) {
                                setTimeOffset = false
                                pattern = currentPattern
                            }
                            if (pattern === null) {
                                pattern = currentPattern
                            }
                        }
                        while (Utils.hasFlag(currentPattern, EmitterPattern.off) && (pattern === null || Utils.hasFlag(pattern, EmitterPattern.off))) {
                            pattern = Math.random() > 0.5 ? Utils.getRandomItem(patterns) : null
                        }
                        let i: number = 0
                        for (let emitter of Emitter.instances) {
                            if (i < djEmitterCount) {
                                emitter.timeOffset = !setTimeOffset ? 0 : (1.2 * 60 / SyncSystem.getInstance().getBPM()) * Math.floor(Math.abs((djEmitterCount - 1) / 2 - i)) / Math.floor((djEmitterCount - 1) / 2)
                            }
                            else {
                                emitter.timeOffset = !setTimeOffset ? 0 : (1.2 * 60 / SyncSystem.getInstance().getBPM()) * (i % 2)
                            }
                            if (pattern !== null) {
                                if (colorMode === 0) {
                                    let colorIndex = colorOffset + i
                                    while (colorIndex < 0) {
                                        colorIndex += colorBank.length
                                    }
                                    while (colorIndex >= colorBank.length) {
                                        colorIndex -= colorBank.length
                                    }
                                    const newColor: Color3 = colorBank[colorIndex]
                                    emitter.setColor(newColor.r, newColor.g, newColor.b, 3 * 60 / SyncSystem.getInstance().getBPM())
                                }
                                if (colorMode === 1) {
                                    var colorIndex = colorOffset + ((i + _beat % 2) % 2) * 3
                                    while (colorIndex >= colorBank.length) {
                                        colorIndex -= colorBank.length
                                    }
                                    while (colorIndex < 0) {
                                        colorIndex += colorBank.length
                                    }
                                    const newColor: Color3 = colorBank[colorIndex]
                                    emitter.setColor(newColor.r, newColor.g, newColor.b, 0.5 * 60 / SyncSystem.getInstance().getBPM())
                                }
                                if (colorMode === 2) {
                                    let colorIndex = colorOffset + i
                                    while (colorIndex < 0) {
                                        colorIndex += colorBank.length
                                    }
                                    while (colorIndex >= colorBank.length) {
                                        colorIndex -= colorBank.length
                                    }
                                    const newColor: Color3 = colorBank[colorIndex]
                                    emitter.setColor(newColor.r, newColor.g, newColor.b, 2 * 60 / SyncSystem.getInstance().getBPM())
                                }
                                emitter.setPattern(pattern)
                            }
                            emitter.pulse()
                            i++
                        }
                        currentPattern = pattern
                        currentTimeOffset = setTimeOffset
                    }
                    else {
                        let i = 0
                        if (colorMode === 2 && _beat % 2 === 0) {
                            colorOffset++
                        }
                        for (let emitter of Emitter.instances) {
                            emitter.pulse(5, 0.25)
                            if (colorMode === 1) {
                                var colorIndex = colorOffset + ((i + _beat % 2) % 2) * 3
                                while (colorIndex >= colorBank.length) {
                                    colorIndex -= colorBank.length
                                }
                                while (colorIndex < 0) {
                                    colorIndex += colorBank.length
                                }
                                const newColor: Color3 = colorBank[colorIndex]
                                emitter.setColor(newColor.r, newColor.g, newColor.b, 0.5 * 60 / SyncSystem.getInstance().getBPM())
                            }
                            if (colorMode === 2 && _beat % 2 === 0) {
                                let colorIndex = colorOffset + i
                                while (colorIndex < 0) {
                                    colorIndex += colorBank.length
                                }
                                while (colorIndex >= colorBank.length) {
                                    colorIndex -= colorBank.length
                                }
                                const newColor: Color3 = colorBank[colorIndex]
                                emitter.setColor(newColor.r, newColor.g, newColor.b, 2 * 60 / SyncSystem.getInstance().getBPM())
                            }
                            i++
                        }
                    }
                }
            })(this))
        engine.addSystem(this.emitterSystem.update.bind(this.emitterSystem))

        // Voice branded colours
        colorBank.push(Color3.White())
        colorBank.push(Color3.fromHexString("#7ecbd9"))
        colorBank.push(Color3.fromHexString("#9b5aa0"))
        colorBank.push(Color3.fromHexString("#ac163f"))
        colorBank.push(Color3.fromHexString("#e62a3d"))

        //const staticEmitter1 = new Emitter(
        //    Vector3.create(37.7931, 23.1432, 64 - 36.5664),
        //    Quaternion.fromEulerDegrees(35, 0, 0),
        //    false
        //)
        //staticEmitter1.useBob = false
        //staticEmitter1.useKickback = false
        //staticEmitter1.setBeamLength(8)
        //const staticEmitter2 = new Emitter(
        //    Vector3.create(64 - 37.7931, 23.1432, 64 - 36.5664),
        //    Quaternion.fromEulerDegrees(35, 0, 0),
        //    false
        //)
        //staticEmitter2.useBob = false
        //staticEmitter2.useKickback = false
        //staticEmitter2.setBeamLength(8)

        //const djEmitterCount = 0
        const djEmitterCount = 6
        const djPosition: Vector3 = Vector3.create(75, 5, 91)
        const emitterSpacing: number = 1
        for (let i = 0; i < djEmitterCount; i++) {

            // hack
            let shiftEmitter = 10
            if (i < 3) {
                shiftEmitter = 4
            }

            let emitter: Emitter = new Emitter(
                Vector3.create(djPosition.x - (emitterSpacing * djEmitterCount / 2) + (i * emitterSpacing) + shiftEmitter, djPosition.y + Math.sin(Math.PI * i / (djEmitterCount - 1)) * 2, djPosition.z - Math.sin(Math.PI * i / (djEmitterCount - 1)) * 1),
                Quaternion.fromEulerDegrees(-60, 0, 0)
            )
            emitter.timeOffset = (1 * 60 / SyncSystem.getInstance().getBPM()) * Math.floor(Math.abs((djEmitterCount - 1) / 2 - i)) / Math.floor((djEmitterCount - 1) / 2)
        }

        const djBeamLength = 30
        const djEmitterPitch = 120
        const djEmitterYaw = 30

        //let djEmitter1: Emitter = new Emitter(Vector3.create(38, 20, -10), Quaternion.multiply(Quaternion.fromEulerDegrees(0, 90 - djEmitterYaw, 0), Quaternion.fromEulerDegrees(djEmitterPitch, 0, 0)))
        //djEmitter1.setBeamLength(djBeamLength)

        //let djEmitter2: Emitter = new Emitter(Vector3.create(26, 20, -10), Quaternion.multiply(Quaternion.fromEulerDegrees(0, -90 + djEmitterYaw, 0), Quaternion.fromEulerDegrees(djEmitterPitch, 0, 0)))
        //djEmitter2.setBeamLength(djBeamLength)

        //let djEmitter3: Emitter = new Emitter(Vector3.create(38, 22, -42), Quaternion.multiply(Quaternion.fromEulerDegrees(0, 180 - djEmitterYaw, 0), Quaternion.fromEulerDegrees(djEmitterPitch, 0, 0)))
        //djEmitter3.setBeamLength(djBeamLength)

        //let djEmitter4: Emitter = new Emitter(Vector3.create(26, 22, -42), Quaternion.multiply(Quaternion.fromEulerDegrees(0, -180 + djEmitterYaw, 0), Quaternion.fromEulerDegrees(djEmitterPitch, 0, 0)))
        //djEmitter4.setBeamLength(djBeamLength)

        // "game loop" for the scene
        const targetDeltaRot: number = 70
        const stayTimeUp: number = 20
        const stayTimeDown: number = 30
        const transitionTime: number = 5
        const baseRot = Quaternion.fromEulerDegrees(40, 0, 0)
        let time: number = 0
        let rotateDown: boolean = true
        let targetRot = Quaternion.Identity()

        const emitterAnimatorSystem = (_deltaTime: number): void => {
            time += _deltaTime

            const stayTime = rotateDown ? stayTimeUp : stayTimeDown
            if (time > stayTime) {
                if (rotateDown) {
                    targetRot = Quaternion.fromEulerDegrees(targetDeltaRot * (time - stayTime) * (1 / transitionTime), 0, 0)
                }
                else {
                    targetRot = Quaternion.fromEulerDegrees(targetDeltaRot * (transitionTime - (time - stayTime)) * (1 / transitionTime), 0, 0)
                }
                if (time > stayTime + transitionTime) {
                    time = 0
                    rotateDown = !rotateDown
                }
            }

            for (let i = 0; i < djEmitterCount; i++) {
                let offset = (djEmitterCount - 1) / 2 - i
                Emitter.instances[i].rotation = Quaternion.multiply(Quaternion.fromEulerDegrees(-60, 0, 0), Quaternion.fromEulerDegrees(0, Math.sin(time * Math.PI * 20 / SyncSystem.getInstance().getBPM()) * 5 * Math.pow(Math.abs(offset), 1.5) * Utils.getSign(offset), 0))
                Emitter.instances[i].rotation = Quaternion.multiply(Quaternion.multiply(Emitter.instances[i].rotation, baseRot), targetRot)
            }
        }
        engine.addSystem(emitterAnimatorSystem)
    }

    end(): void {
        Emitter.instances.forEach(emitter => {
            emitter.hide()
        });
    }
}