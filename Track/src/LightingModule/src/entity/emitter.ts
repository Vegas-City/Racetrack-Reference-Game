import { EmitterPattern } from "../enums/emitterEnum";
import { Beam } from "./beam";
import { Color3, Quaternion, Vector3 } from "@dcl/ecs-math";
import { Entity, GltfContainer, Transform, engine } from "@dcl/ecs";
import { MaterialConfig } from "../types/materialConfig";

/* entity definition */

export class Emitter {

    /* constants */

    static readonly BEAM_COUNT: number = 8
    static readonly BEAM_WIDTH: number = 0.25
    static readonly BEAM_SPREAD: number = 0.1
    static readonly EMISSIVE_MULTIPLIER: number = 0.85
    static readonly EMITTER_GLTF: string = "models/emitter.gltf"
    static readonly BEAM_ALPHA_TEXTURE: string = "models/beam_a.png"

    /* static fields */

    static instances: Emitter[] = []

    /* fields */

    entity: Entity
    position: Vector3 = Vector3.Zero()
    rotation: Quaternion = Quaternion.Identity()

    patternStart: number = 0
    patternTime: number = 0
    fade: number = 0
    fadeDuration: number = 0.5
    material: MaterialConfig = {}
    targetColor: Color3 = Color3.White()
    colorBlendDuration: number = 1
    pulseStrength: number = 0
    pulseDuration: number = 0
    pulseTime: number = 0
    beams: Beam[] = []
    timeOffset: number = 0
    private pattern: EmitterPattern = EmitterPattern.off

    useBob: boolean = true
    useKickback: boolean = true

    /* constructor */

    constructor(_parent: Entity, _position: Vector3 = Vector3.Zero(), _rotation: Quaternion = Quaternion.Identity(), _useGraphic: boolean = true) {
        // initialise the transform
        this.position = _position
        this.rotation = _rotation

        this.entity = engine.addEntity()
        Transform.createOrReplace(this.entity, {
            parent: _parent,
            position: Vector3.clone(_position),
            rotation: Quaternion.create(_rotation.x, _rotation.y, _rotation.z, _rotation.w)
        })

        // initialise the material for this emitter and apply it
        this.material.emissiveColor = Color3.create(0, 1, 1)
        this.material.emissiveIntensity = 7
        this.material.roughness = 1
        this.material.metallic = 0
        this.material.castShadows = false
        this.material.transparencyMode = 2
        this.material.alphaTexture = Emitter.BEAM_ALPHA_TEXTURE
        this.material.emissiveTexture = Emitter.BEAM_ALPHA_TEXTURE

        // create the child beams
        for (let i = 0; i < Emitter.BEAM_COUNT; i++) {
            this.beams.push(new Beam(this))
        }

        // ensure the shared emitter shape and apply it
        if (_useGraphic) {
            GltfContainer.createOrReplace(this.entity, {
                src: Emitter.EMITTER_GLTF
            })
        }

        Emitter.instances.push(this)
    }

    /* methods */

    getPattern(): EmitterPattern {
        return this.pattern
    }

    pulse(_pulseStrength: number = 15, _pulseDuration: number = 0.5): void {
        this.pulseStrength = _pulseStrength
        this.pulseDuration = _pulseDuration
        this.pulseTime = _pulseDuration
    }

    setBeamLength(beamLength: number): void {
        for (let beam of this.beams) {
            beam.length = beamLength
        }
    }

    setColor(_red: number, _green: number, _blue: number, _transitionDuration: number = 1): void {
        this.targetColor = Color3.create(_red, _green, _blue)
        this.colorBlendDuration = _transitionDuration
        if (_transitionDuration <= 0) {
            this.material.emissiveColor = Color3.create(this.targetColor.r, this.targetColor.g, this.targetColor.b)
            this.colorBlendDuration = 1
        }
        this.updateMaterial()
    }

    setPattern(_pattern: EmitterPattern): void {
        this.pattern = _pattern
        this.patternTime = 0
        this.patternStart = new Date().getTime()
    }

    updateMaterial(): void {
        this.beams.forEach(beam => {
            beam.updateMaterial(this.material)
        })
    }

    hide(): void {
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }
}