import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { InputManager, TrackManager } from "@vegascity/racetrack/src/racetrack"
import { setup } from "@vegascity/racetrack/src/utils"
import { movePlayerTo, triggerSceneEmote } from "~system/RestrictedActions"
import { Minimap } from "@vegascity/racetrack/src/ui"
import { RaceMenuManager } from './RaceMenu/raceMenuManager'
import { ServerComms } from './Server/serverComms'
import { GhostRecorder } from '@vegascity/racetrack/src/ghostCar'
import { EventUIEnum, EventUIImage } from './UI/eventUIImage'
import { ShopController } from './shop/shop-controller'
import { UserData } from './Server/Helper'
import { Buildings } from './Buildings/Buildings'
import { Car } from '@vegascity/racetrack/src/car'
import { NPCManager } from './NPCs/NPCManager'
import { AvatarVisibilityManager } from './avatarVisibilityManager'
import { ParticleSystem } from './particleSystem/particleSystem'
import { ShopMenu } from './shop/ShopMenu'
import { CarSpecsMenuManager } from './CarSpecsMenu/carSpecsMenuManager'
import * as trackConfig1 from "../data/track_01.json"
import * as trackConfig2 from "../data/track_02.json"
import * as trackConfig3 from "../data/track_03.json"
import * as trackConfig4 from "../data/track_04.json"
import * as utils from '@dcl-sdk/utils'
import { InputAction, Material, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, Transform, engine, inputSystem } from '@dcl/sdk/ecs'

export class Scene {

    static loaded: boolean = false
    static shopController: ShopController

    static LoadBuildings(): void {
        new Buildings()
    }

    static LoadScene(): void {
        setup(movePlayerTo, triggerSceneEmote)

        new InputManager()

        Scene.shopController = new ShopController()
        new ShopMenu()
        new ServerComms()
        Scene.shopController.updateCollection(UserData.cachedData.publicKey)
        Scene.shopController.setupClickables()



        new TrackManager({
            position: Vector3.create(-32, 1, 16),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            debugMode: false,
            eventCallbacks: {
                onStartEvent: () => {
                    ServerComms.recordAttempt({
                        car: ServerComms.currentCar,
                        track: ServerComms.currentTrack,
                        checkpoint: 0,
                        time: 0
                    })

                    // Load ghost from the server if we don't have a ghost for this track and is not practice mode
                    if (!TrackManager.isPractice) {
                        ServerComms.getGhostCarData()
                    } else {
                        if (TrackManager.ghostRecorder.currentGhostData.points.length > 0 && TrackManager.ghostRecorder.currentGhostData.track == ServerComms.currentTrack) {
                            TrackManager.ghostCar.startGhost()
                        }
                    }

                    TrackManager.ghostRecorder.start(ServerComms.currentTrack)
                },
                onEndEvent: () => {
                    let lap = TrackManager.GetLap()
                    if (!lap) return

                    ServerComms.recordAttempt({
                        car: ServerComms.currentCar,
                        track: ServerComms.currentTrack,
                        checkpoint: lap.checkpoints.length * 2,
                        time: Math.round(lap.timeElapsed * 1000)
                    }).then(() => {
                        ServerComms.setTrack(ServerComms.currentTrack)
                        ServerComms.getPlayerData(true)
                    })

                    // Send the ghost to the server at game end
                    if (GhostRecorder.instance != null) {
                        ServerComms.sendGhostCarData(GhostRecorder.instance.getGhostData())
                    }

                    utils.timers.setTimeout(() => {
                        Car.unload()
                    }, 5000)
                },
                onCheckpointEvent: () => {
                    let lap = TrackManager.GetLap()
                    if (!lap) return

                    ServerComms.recordAttempt({
                        car: ServerComms.currentCar,
                        track: ServerComms.currentTrack,
                        checkpoint: lap.checkpointIndex + (lap.checkpoints.length * lap.lapsCompleted),
                        time: Math.round(lap.timeElapsed * 1000)
                    })
                },
                onLapCompleteEvent: () => {
                    let lap = TrackManager.GetLap()
                    if (!lap) return

                    EventUIImage.triggerEvent(EventUIEnum.lapEvent)

                    ServerComms.recordAttempt({
                        car: ServerComms.currentCar,
                        track: ServerComms.currentTrack,
                        checkpoint: lap.checkpointIndex + (lap.checkpoints.length * lap.lapsCompleted),
                        time: Math.round(lap.timeElapsed * 1000)
                    })

                    if (TrackManager.isPractice) {
                        if (Math.round(lap.timeElapsed) < 50) {
                            ServerComms.completePractice()
                        }
                    }
                }
            },
            trackConfigs: [
                {
                    index: 0,
                    guid: "6a0a3950-bcfb-4eb4-9166-61edc233b82b",
                    data: trackConfig1
                },
                {
                    index: 1,
                    guid: "17e75c78-7f17-4b7f-8a13-9d1832ec1231",
                    data: trackConfig2
                },
                {
                    index: 2,
                    guid: "ec2a8c30-678a-4d07-b56e-7505ce8f941a",
                    data: trackConfig3
                },
                {
                    index: 3,
                    guid: "a8ceec44-5a8f-4c31-b026-274c865ca689",
                    data: trackConfig4
                }
            ],
            respawnPosition: Vector3.create(0, 2.1, 5),
            respawnDirection: Vector3.create(0, 5, 20),
        })

        new CarSpecsMenuManager(Vector3.create(36, 0.9, 0))
        new NPCManager()
        new ParticleSystem()

        new RaceMenuManager(Vector3.create(0, 0.9, 10.6))
        RaceMenuManager.LoadTrack(0) // load practice track by default

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

        new AvatarVisibilityManager()
        Scene.InitialiseExperimentalMode()

        Scene.loaded = true
    }

    static LoadMenu(): void {
        let menuTransform = Transform.getMutableOrNull(RaceMenuManager.instance.baseEntity)
        if (menuTransform) {
            menuTransform.scale = Vector3.One()
        }
    }

    private static InitialiseExperimentalMode(): void {
        let experimentalModeEntity = engine.addEntity()
        Transform.create(experimentalModeEntity, {
            position: Vector3.create(-13, 2, 7),
            scale: Vector3.create(0.6, 0.6, 0.6)
        })
        Material.setPbrMaterial(experimentalModeEntity, {
            albedoColor: Color4.Black()
        })
        MeshRenderer.setSphere(experimentalModeEntity)
        MeshCollider.setSphere(experimentalModeEntity)
        PointerEvents.create(experimentalModeEntity, {
            pointerEvents: [
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        hoverText: "Experimental Mode",
                        maxDistance: 10
                    }
                }
            ]
        })

        engine.addSystem((dt: number) => {
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, experimentalModeEntity)) {
                TrackManager.experimentalMode = !TrackManager.experimentalMode
                let hoverText = TrackManager.experimentalMode ? "Normal Mode" : "Experimental Mode"
                PointerEvents.createOrReplace(experimentalModeEntity, {
                    pointerEvents: [
                        {
                            eventType: PointerEventType.PET_DOWN,
                            eventInfo: {
                                button: InputAction.IA_POINTER,
                                hoverText: hoverText,
                                maxDistance: 10
                            }
                        }
                    ]
                })
                Material.setPbrMaterial(experimentalModeEntity, {
                    albedoColor: TrackManager.experimentalMode ? Color4.Red() : Color4.Black()
                })
            }
        })
    }
} 