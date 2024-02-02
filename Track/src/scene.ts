import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { CarFactory } from "@vegascity/racetrack/src/car"
import { PhysicsManager } from "@vegascity/racetrack/src/physics"
import { GameManager, InputManager, TrackManager } from "@vegascity/racetrack/src/racetrack"
import { setup } from "@vegascity/racetrack/src/utils"
import { setupUi } from "./UI/ui"
import * as trackConfig1 from "../data/track_01.json"
import * as trackConfig2 from "../data/track_02.json"
import * as trackConfig3 from "../data/track_03.json"
import { movePlayerTo, triggerSceneEmote } from "~system/RestrictedActions"
import { Minimap } from "@vegascity/racetrack/src/ui"


export class Scene {

    static loaded:boolean = false

    static LoadScene(): void {
        setup(movePlayerTo, triggerSceneEmote)

        
        new InputManager()
        new TrackManager(Vector3.create(-32, 1, 16), Quaternion.fromEulerDegrees(0, 180, 0), Vector3.create(1, 1, 1), false)
        new PhysicsManager()
        Scene.LoadCar()
        Scene.LoadTrack(1) // load first track by default
        Scene.loaded = true
    }

    static LoadCar() {
        CarFactory.create({
            mass: 150,
            accelerationF: 12,
            accelerationB: 12,
            deceleration: 4,
            minSpeed: -14,
            maxSpeed: 25,
            steerSpeed: 1.5,
            grip: 0.3,
            engineStartAudio: 'audio/engineStart.mp3',
            carGLB: 'models/cars/car1/car.glb',
            carColliderGLB: 'models/cars/car1/carCollider.glb',
            leftWheelGLB: 'models/cars/car1/wheel_left.glb',
            rightWheelGLB: 'models/cars/car1/wheel_right.glb',
            steeringWheelGLB: 'models/cars/car1/steering_wheel.glb',
            brakeLightsGLB: 'models/cars/car1/brakeLights.glb',
            wheelX_L: 1,
            wheelX_R: 1,
            wheelZ_F: 1.37,
            wheelZ_B: 1.57,
            wheelY: -0.3,
            carScale: 0.7,
            firstPersonCagePosition: Vector3.create(-0.15, -1.3, 0),
            thirdPersonCagePosition: Vector3.create(0, -0.2, -1.1),
        }, Vector3.create(8.45, 2+1, 23.7), 90)
    }

    static LoadTrack(_trackNumber: number) {
        GameManager.reset()
        let minimapSrc: string = ""
        switch (_trackNumber) {
            case 1: TrackManager.Load(trackConfig1)
                minimapSrc = "images/minimap1.png"
                break
            case 2: TrackManager.Load(trackConfig2)
                minimapSrc = "images/minimap2.png"
                break
            case 3: TrackManager.Load(trackConfig3)
                minimapSrc = "images/minimap3.png"
                break
        }
        Minimap.Load(
            {
                src: minimapSrc,
                srcWidth: 704,
                srcHeight: 576,
                parcelWidth: 11,
                parcelHeight: 9,
                bottomLeftX: -32,
                bottomLeftZ: 16,
                paddingX: 5,
                paddingZ: 4
            }
        )
    }
} 