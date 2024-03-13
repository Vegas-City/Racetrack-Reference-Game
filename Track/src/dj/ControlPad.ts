/* imports */

import { Billboard, Entity, Font, GltfContainer, InputAction, Material, MaterialTransparencyMode, MeshRenderer, PointerEventType, PointerEvents, TextShape, TextureFilterMode, TextureWrapMode, Transform, engine, inputSystem } from "@dcl/sdk/ecs"
import { SyncSystem } from "./SyncSystem"
import { TransformConfig } from "./TransformConfig"
import { Utils } from "./Utils"
import { Color3, Quaternion, Vector3 } from "@dcl/sdk/math"
import { MessageBus } from '@dcl/sdk/message-bus'

/* private types */

class ControlPadLCDCharacter {

    /* constants */

    static readonly CHARACTER_TEXTURE: string = "textures/control-pad.png"

    /* fields */

    entity: Entity

    /* constructor */

    constructor(_config: TransformConfig) {

        this.entity = engine.addEntity()

        // set up the transform
        Transform.createOrReplace(this.entity, {
            parent: Utils.coalesce(_config.parent, undefined),
            position: Utils.coalesce(_config.position, Vector3.Zero()),
            rotation: Quaternion.multiply(_config.rotation ?? Quaternion.Identity(), Quaternion.fromEulerDegrees(0, 0, -90)),
            scale: Utils.coalesce(_config.scale, Vector3.One())
        })

        // set up the shape
        this.setCharacter(0)

        // apply the material
        Material.setPbrMaterial(this.entity, {
            roughness: 0.3,
            metallic: 0.3,
            castShadows: false,
            transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
            texture: Material.Texture.Common({
                src: ControlPadLCDCharacter.CHARACTER_TEXTURE,
                wrapMode: TextureWrapMode.TWM_CLAMP,
                filterMode: TextureFilterMode.TFM_TRILINEAR
            }),
        })
    }

    /* methods */

    setCharacter(_character: number): ControlPadLCDCharacter {
        const w = 96 / 1024
        const h = 128 / 512
        const uvs = Utils.setUVs(_character * w, 0, w, h, "BOTH")
        MeshRenderer.setPlane(this.entity, uvs)
        return this
    }
}

type ControlPadLCDConfig = TransformConfig & {

    characterCount?: number
    characterSpacing?: number

    value?: number
}

class ControlPadLCD {

    /* fields */

    characters: ControlPadLCDCharacter[]

    /* constructor */

    constructor(_config: ControlPadLCDConfig) {

        // parse the config
        _config.parent = Utils.coalesce(_config.parent, undefined)
        _config.position = Utils.coalesce(_config.position, Vector3.Zero())
        _config.rotation = Utils.coalesce(_config.rotation, Quaternion.Identity())
        _config.scale = Utils.coalesce(_config.scale, Vector3.One())
        _config.characterCount = Utils.coalesce(_config.characterCount, 3)
        _config.characterSpacing = Utils.coalesce(_config.characterSpacing, 0.2)
        _config.value = Utils.coalesce(_config.value, 0)

        // create the characters
        this.characters = []
        for (let i = 0; i < (_config.characterCount ?? 0); i++) {

            // create the new character and register it
            const offset = (((_config.characterCount ?? 0) - 1) / 2) - i
            const character = new ControlPadLCDCharacter({
                parent: _config.parent,
                position: Vector3.add(_config.position ?? Vector3.Zero(), Vector3.create(0, 0, offset * ((_config.scale?.x ?? 0) + ((_config.scale?.x ?? 0) * (_config.characterSpacing ?? 0))))),
                rotation: _config.rotation,
                scale: _config.scale
            })
            this.characters.push(character)
        }

        // set the initial value
        this.setValue(_config.value ?? 0)
    }

    /* methods */

    setValue(_value: number): ControlPadLCD {
        const valueString: string = _value.toFixed(0)
        let j = 0
        for (let i = this.characters.length - 1; i > -1; i--) {
            const idx = valueString.length - 1 - j
            if (idx > -1) {
                this.characters[i].setCharacter(parseInt(valueString[idx]))
            }
            else {
                this.characters[i].setCharacter(0)
            }
            j++
        }
        return this
    }
}

export type ControlPadAction = "HORNS" | "ARMS OUT"
export type ControlPadIntensity = "OFF" | "NORMAL" | "HIGH"

/* entity definition */

export class ControlPad {

    /* constants */

    static readonly GLTF: string = "models/control-pad.glb"

    /* fields */

    private entity: Entity
    private beatDisplayEntity: Entity
    private beatsPerBarDisplay: ControlPadLCD
    private beatUnitDisplay: ControlPadLCD
    private tempoDisplay: ControlPadLCD

    private bpm: number
    private bpmNoteFraction: number
    private beatsPerBar: number
    private beatUnit: number

    private bpmTapTimes: number[] = []

    private onActionListeners: ((_action: ControlPadAction) => void)[] = []
    private onIntensityListeners: ((_intensity: ControlPadIntensity) => void)[] = []

    private messageBus = new MessageBus()

    /* constructor */

    constructor(_config: TransformConfig) {

        this.entity = engine.addEntity()

        // initialise the transform
        const transform = Transform.createOrReplace(this.entity, {
            position: Utils.coalesce(_config.position, Vector3.Zero()),
            rotation: Utils.coalesce(_config.rotation, Quaternion.Identity()),
            scale: Utils.coalesce(_config.scale, Vector3.One())
        })

        // initialise the shape
        GltfContainer.createOrReplace(this.entity, {
            src: ControlPad.GLTF
        })

        // set up the lcd displays
        const syncSystem = SyncSystem.getInstance()
        syncSystem.onBeat(((_target) => (_isPrimary: boolean, _beat: number): void => _target.onBeat(_isPrimary, _beat))(this))
        syncSystem.onTapBPM(
            ((_target) => {
                return (_bpm: number): void => {
                    _target.bpm = _bpm
                    _target.tempoDisplay.setValue(this.bpm)
                    this.messageBus.emit("djSetBPM", { bpm: this.bpm, timestamp: new Date().getTime() - (3 * 60 / _target.bpm * 1000) })
                }
            })(this))
        this.bpmNoteFraction = syncSystem.getBPMNoteFraction()
        this.bpm = syncSystem.getBPM()
        this.beatsPerBar = syncSystem.getBeatsPerBar()
        this.beatUnit = syncSystem.getBeatUnit()
        this.beatsPerBarDisplay = new ControlPadLCD({
            parent: this.entity,
            position: Vector3.create(0.547529, 0.550622, 0.5), // new Vector3(0.321998, 0.528571, 0.5)
            rotation: Quaternion.multiply(Quaternion.fromEulerDegrees(0, 0, 5.8), Quaternion.fromEulerDegrees(90, 0, 0)),
            scale: Vector3.create(0.09375, 0.125, 1),
            characterCount: 1,
            characterSpacing: 0,
            value: this.beatsPerBar
        })
        this.beatUnitDisplay = new ControlPadLCD({
            parent: this.entity,
            position: Vector3.create(0.321998, 0.528571, 0.5),
            rotation: Quaternion.multiply(Quaternion.fromEulerDegrees(0, 0, 5.8), Quaternion.fromEulerDegrees(90, 0, 0)),
            scale: Vector3.create(0.09375, 0.125, 1),
            characterCount: 1,
            characterSpacing: 0,
            value: this.beatUnit
        })
        this.tempoDisplay = new ControlPadLCD({
            parent: this.entity,
            position: Vector3.create(0.547529, 0.550622, -0.5), // new Vector3(0.321998, 0.528571, 0.5)
            rotation: Quaternion.multiply(Quaternion.fromEulerDegrees(0, 0, 5.8), Quaternion.fromEulerDegrees(90, 0, 0)),
            scale: Vector3.create(0.09375, 0.125, 1),
            characterCount: 3,
            characterSpacing: 0.2,
            value: this.bpm
        })

        // show a beat tracker above the control pad
        this.beatDisplayEntity = engine.addEntity()
        Transform.createOrReplace(this.beatDisplayEntity, {
            parent: this.entity,
            position: Vector3.create(1.2, 1.2, 0),
            rotation: Quaternion.multiply(Utils.getInverseQuaternion(transform.rotation), Quaternion.fromEulerDegrees(0, 180, 0)),
            scale: Vector3.create(0.75, 0.75, 0.75)
        })
        TextShape.createOrReplace(this.beatDisplayEntity, {
            text: "<size=150%>1</b>",
            font: Font.F_SANS_SERIF,
            outlineColor: Color3.create(0, 0, 0),
            outlineWidth: 0.25
        })
        Billboard.createOrReplace(this.beatDisplayEntity)

        // set up the click events
        PointerEvents.createOrReplace(this.entity, {
            pointerEvents: [
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        maxDistance: 4,
                        hoverText: "Use KONTROL",
                        showFeedback: true
                    }
                }
            ]
        })

        engine.addSystem(() => {
            const cmd = inputSystem.getInputCommand(
                InputAction.IA_POINTER,
                PointerEventType.PET_DOWN,
                this.entity
            )
            if (cmd) {
                switch (cmd.hit?.meshName?.toLowerCase()) {
                    case "btnapplytempo": {
                        SyncSystem.getInstance().setBPM(this.bpm)
                        this.messageBus.emit("djSetBPM", { bpm: this.bpm, timestamp: new Date().getTime(), beatNumber: 0 })
                    } break
                    case "btnapplytimesignature": {
                        SyncSystem.getInstance().setTimeSignature(this.beatsPerBar, this.beatUnit)
                    } break
                    case "btnarmsout": {
                        this.fireAction("ARMS OUT")
                    } break
                    case "btndecbeatsperbar": {
                        this.beatsPerBar--
                        this.beatsPerBarDisplay.setValue(this.beatsPerBar)
                    } break
                    case "btndecbeatunit": {
                        this.beatUnit--
                        this.beatUnitDisplay.setValue(this.beatUnit)
                    } break
                    case "btndectempo": {
                        this.bpm--
                        this.tempoDisplay.setValue(this.bpm)
                    } break
                    case "btnhigh": {
                        this.setIntensity("HIGH")
                    } break
                    case "btnhorns": {
                        this.fireAction("HORNS")
                    } break
                    case "btnincbeatsperbar": {
                        this.beatsPerBar++
                        this.beatsPerBarDisplay.setValue(this.beatsPerBar)
                    } break
                    case "btnincbeatunit": {
                        this.beatUnit++
                        this.beatUnitDisplay.setValue(this.beatUnit)
                    } break
                    case "btninctempo": {
                        this.bpm++
                        this.tempoDisplay.setValue(this.bpm)
                    } break
                    case "btnnormal": {
                        this.setIntensity("NORMAL")
                    } break
                    case "btnoff": {
                        this.setIntensity("OFF")
                    } break
                    case "btntaptempo": {
                        this.bpmTapTimes.push(new Date().getTime())
                        if (this.bpmTapTimes.length > 1 && this.bpmTapTimes[this.bpmTapTimes.length - 1] - this.bpmTapTimes[this.bpmTapTimes.length - 2] >= 3000) {
                            this.bpmTapTimes = [new Date().getTime()]
                            this.tempoDisplay.setValue(this.bpm)
                            console.log("too long - reset bpm tap")
                        }
                        if (this.bpmTapTimes.length >= this.beatsPerBar) {
                            let averageTapTime = 0
                            for (let i = 0; i < this.bpmTapTimes.length - 1; i++) {
                                averageTapTime += this.bpmTapTimes[i + 1] - this.bpmTapTimes[i]
                            }
                            averageTapTime /= (this.bpmTapTimes.length - 1)
                            this.bpmTapTimes = []
                            this.bpm = Math.round(60 / (averageTapTime / 1000))
                            this.tempoDisplay.setValue(this.bpm)
                        }
                    } break
                    case "chassis":
                    case "screen-covers": {
                        // ignore - non interactive
                    } break
                    default: {
                        console.log("Unrecognised button = " + cmd.hit?.meshName)
                    } break
                }
            }
        })
    }

    /* methods */

    private fireAction(_action: ControlPadAction): void {
        for (let l of this.onActionListeners) {
            l(_action)
        }
    }

    private onBeat(_isPrimary: boolean, _beat: number): void {
        const beatDisplay = TextShape.getMutableOrNull(this.beatDisplayEntity)
        if (beatDisplay === undefined || beatDisplay === null) {
            return
        }
        beatDisplay.text = (_isPrimary ? "<size=150%>" : "") + (_beat + 1).toFixed(0) + (_isPrimary ? "</size>" : "")
    }

    private setIntensity(_intensity: ControlPadIntensity): void {
        for (let l of this.onIntensityListeners) {
            l(_intensity)
        }
    }

    onAction(_listener: (_action: ControlPadAction) => void): ControlPad {
        this.onActionListeners.push(_listener)
        return this
    }

    onIntensity(_listener: (_intensity: ControlPadIntensity) => void): ControlPad {
        this.onIntensityListeners.push(_listener)
        return this
    }
}