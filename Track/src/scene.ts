import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { PhysicsManager } from "@vegascity/racetrack/src/physics"
import { GameManager, InputManager, Lap, TrackManager } from "@vegascity/racetrack/src/racetrack"
import { setup } from "@vegascity/racetrack/src/utils"
import { movePlayerTo, triggerSceneEmote } from "~system/RestrictedActions"
import { Minimap } from "@vegascity/racetrack/src/ui"
import { CarSelectionManager } from './CarSelection/carSelectionManager'
import { ServerComms } from './Server/serverComms'
import * as trackConfig1 from "../data/track_01.json"
import * as trackConfig2 from "../data/track_02.json"
import * as trackConfig3 from "../data/track_03.json"
import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'

export class Scene {

    static loaded: boolean = false

    static LoadScene(): void {
        setup(movePlayerTo, triggerSceneEmote)

        new ServerComms()
        new InputManager()
        new TrackManager(Vector3.create(-32, 1, 16), Quaternion.fromEulerDegrees(0, 180, 0), Vector3.create(1, 1, 1), false,
            () => {
                ServerComms.recordAttempt({
                    car: "",
                    track: "",
                    checkpoint: 0,
                    time: 0
                })
            },
            () => {
                ServerComms.recordAttempt({
                    car: "",
                    track: "",
                    checkpoint: Lap.checkpointIndex + (Lap.checkpoints.length * (Lap.lapsCompleted * 2)),
                    time: Math.round(Lap.timeElapsed * 1000)
                })
            },
            () => {
                ServerComms.recordAttempt({
                    car: "",
                    track: "",
                    checkpoint: Lap.checkpointIndex + (Lap.checkpoints.length * Lap.lapsCompleted),
                    time: Math.round(Lap.timeElapsed * 1000)
                })
            }
        )
        new PhysicsManager()
        Scene.LoadTrack(1) // load first track by default
        Scene.loaded = true

        new CarSelectionManager(Vector3.create(7, 1.3, 11))

        // Scene parcels
        let sceneParcels: Entity = engine.addEntity()
        GltfContainer.create(sceneParcels, { src: "models/SceneParcels.glb" })
        Transform.create(sceneParcels, {
            position: Vector3.create(-32, 1, 16),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0)
        })
    }

    static LoadTrack(_trackNumber: number) {
        GameManager.reset()
        let minimapSrc: string = ""
        switch (_trackNumber) {
            case 1: TrackManager.Load(trackConfig1)
                Minimap.Load(
                    {
                        src: "images/ui/minimapUI/minimap1.png",
                        srcWidth: 739,
                        srcHeight: 605,
                        parcelWidth: 11,
                        parcelHeight: 9,
                        bottomLeftX: -32,
                        bottomLeftZ: 16,
                        offsetX: 7,
                        offsetZ: 6,
                        checkpointOffsetX: 9.5,
                        checkpointOffsetZ: 9.5,
                        srcPaddingX: 35,
                        srcPaddingZ: 29
                    }
                )
                break
            case 2: TrackManager.Load(trackConfig2)
                Minimap.Load(
                    {
                        src: "images/ui/minimapUI/minimap2.png",
                        srcWidth: 704,
                        srcHeight: 576,
                        parcelWidth: 11,
                        parcelHeight: 9,
                        bottomLeftX: -32,
                        bottomLeftZ: 16,
                        offsetX: 5,
                        offsetZ: 4,
                        checkpointOffsetX: 5,
                        checkpointOffsetZ: 4,
                        checkpointLength: 15,
                        checkpointWidth: 4
                    }
                )
                break
            case 3: TrackManager.Load(trackConfig3)
                Minimap.Load(
                    {
                        src: "images/ui/minimapUI/minimap3.png",
                        srcWidth: 704,
                        srcHeight: 576,
                        parcelWidth: 11,
                        parcelHeight: 9,
                        bottomLeftX: -32,
                        bottomLeftZ: 16,
                        offsetX: 5,
                        offsetZ: 4,
                        checkpointOffsetX: 5,
                        checkpointOffsetZ: 4,
                        checkpointLength: 15,
                        checkpointWidth: 4
                    }
                )
                break
        }
    }
} 