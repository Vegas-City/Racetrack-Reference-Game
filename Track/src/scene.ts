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
import { CarSelectionManager } from './CarSelection/carSelectionManager'


export class Scene {

    static loaded: boolean = false

    static LoadScene(): void {
        setup(movePlayerTo, triggerSceneEmote)


        new InputManager()
        new TrackManager(Vector3.create(-32, 1, 16), Quaternion.fromEulerDegrees(0, 180, 0), Vector3.create(1, 1, 1), false)
        new PhysicsManager()
        Scene.LoadTrack(1) // load first track by default
        Scene.loaded = true
        
        new CarSelectionManager()
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