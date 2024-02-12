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
import * as trackConfig4 from "../data/track_04.json"
import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { GhostRecorder } from '@vegascity/racetrack/src/ghostCar'

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

                // Send the ghost to the server at game end
                if (GhostRecorder.instance != null) {
                    ServerComms.sendGhostCarData(GhostRecorder.instance.getGhostData())
                }
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
        Scene.LoadTrack(0) // load practice track by default
        Scene.loaded = true

        new CarSelectionManager(Vector3.create(7, 1.3, 11))

        // Scene parcels
        let sceneParcels: Entity = engine.addEntity()
        GltfContainer.create(sceneParcels, { src: "models/SceneParcels.glb" })
        Transform.create(sceneParcels, {
            position: Vector3.create(-32, 1, 16),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0)
        })

        Minimap.InitialiseAssets({
            lapImages: ["images/ui/minimapUI/lap1.png", "images/ui/minimapUI/lap2.png"],
            minimapImages: ["images/ui/minimapUI/TRACK_1.png", "images/ui/minimapUI/TRACK_2.png", "images/ui/minimapUI/TRACK_3.png", "images/ui/minimapUI/TRACK_4.png"],
            checkpointImages: [
                [
                    "images/ui/minimapUI/checkpoints/0_0.png",
                    "images/ui/minimapUI/checkpoints/0_1.png",
                    "images/ui/minimapUI/checkpoints/0_2.png",
                    "images/ui/minimapUI/checkpoints/0_3.png",
                    "images/ui/minimapUI/checkpoints/0_4.png",
                    "images/ui/minimapUI/checkpoints/0_5.png",
                    "images/ui/minimapUI/checkpoints/0_6.png",
                    "images/ui/minimapUI/checkpoints/0_7.png"
                ],
                [
                    "images/ui/minimapUI/checkpoints/1_0.png",
                    "images/ui/minimapUI/checkpoints/1_1.png",
                    "images/ui/minimapUI/checkpoints/1_2.png",
                    "images/ui/minimapUI/checkpoints/1_3.png",
                    "images/ui/minimapUI/checkpoints/1_4.png",
                    "images/ui/minimapUI/checkpoints/1_5.png",
                    "images/ui/minimapUI/checkpoints/1_6.png",
                    "images/ui/minimapUI/checkpoints/1_7.png"
                ],
                [
                    "images/ui/minimapUI/checkpoints/2_0.png",
                    "images/ui/minimapUI/checkpoints/2_1.png",
                    "images/ui/minimapUI/checkpoints/2_2.png",
                    "images/ui/minimapUI/checkpoints/2_3.png",
                    "images/ui/minimapUI/checkpoints/2_4.png",
                    "images/ui/minimapUI/checkpoints/2_5.png",
                    "images/ui/minimapUI/checkpoints/2_6.png",
                    "images/ui/minimapUI/checkpoints/2_7.png",
                    "images/ui/minimapUI/checkpoints/2_8.png"
                ],
                [
                    "images/ui/minimapUI/checkpoints/3_0.png",
                    "images/ui/minimapUI/checkpoints/3_1.png",
                    "images/ui/minimapUI/checkpoints/3_2.png",
                    "images/ui/minimapUI/checkpoints/3_3.png",
                    "images/ui/minimapUI/checkpoints/3_4.png",
                    "images/ui/minimapUI/checkpoints/3_5.png",
                    "images/ui/minimapUI/checkpoints/3_6.png",
                    "images/ui/minimapUI/checkpoints/3_7.png",
                    "images/ui/minimapUI/checkpoints/3_8.png",
                    "images/ui/minimapUI/checkpoints/3_9.png",
                    "images/ui/minimapUI/checkpoints/3_10.png",
                    "images/ui/minimapUI/checkpoints/3_11.png"
                ]
            ]
        })
    }

    static LoadTrack(_trackNumber: number) {
        GameManager.reset()
        switch (_trackNumber) {
            case 0: TrackManager.trackID = 1
                TrackManager.isPractice = true
                TrackManager.Load(trackConfig1)
                Lap.totalLaps = 1
                break
            case 1: TrackManager.trackID = 1
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig1)
                Lap.totalLaps = 2
                break
            case 2: TrackManager.trackID = 2
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig2)
                Lap.totalLaps = 2
                break
            case 3: TrackManager.trackID = 3
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig3)
                Lap.totalLaps = 2
                break
            case 4: TrackManager.trackID = 4
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig4)
                Lap.totalLaps = 2
                break
        }
        Minimap.Load(
            {
                srcWidth: 992,
                srcHeight: 815,
                parcelWidth: 11,
                parcelHeight: 9,
                bottomLeftX: -32,
                bottomLeftZ: 16,
                offsetX: 0.75,
                offsetZ: 0.75,
                paddingBottom: 51,
                paddingTop: 45,
                paddingLeft: 60,
                paddingRight: 50,
                scale: 0.3
            }
        )
    }
} 