import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { LeaderboardUI } from "../UI/leaderboardUI";
import { DJ } from "./dj";
import { Schedule, ScheduleManager } from "./scheduleManager";
import { Countdown3d } from "../UI/countdown3d";
import { PodiumNPCs } from "./podiumNPC";
import { FireWorkManager } from "../Fireworks/fireworkManager";
import { Scene } from "../scene";
import { BigScreen } from "./bigScreen";
import { SmallScreen } from "./smallScreen";
import { NPCManager } from "../NPCs/NPCManager";
import { AudioManager } from "../audio/audioManager";
import { LightingModuleManager } from "../LightingModule/src/lightingModuleManager";
import * as dj from '../dj/index'

export class PartyManager {
    static instance: PartyManager

    dj: DJ
    leaderboard: LeaderboardUI
    podiumNPCs: PodiumNPCs
    bigScreen: BigScreen
    smallScreens: SmallScreen[] = []
    fireworkManager: FireWorkManager
    lightingModuleManager: LightingModuleManager

    djStartTime: number = Date.UTC(2024, 2, 17, 20, 0)
    djEndTime: number = Date.UTC(2024, 2, 17, 20, 30)
    ceremonyMusicStart: number = Date.UTC(2024, 2, 17, 20, 31)
    ceremonyMusicEnd: number = Date.UTC(2024, 2, 17, 20, 48)

    constructor() {

        PartyManager.instance = this

        if(!this.fireworkManager){
            this.fireworkManager = new FireWorkManager()
        }

        if(!this.leaderboard){
            this.leaderboard = new LeaderboardUI(Vector3.create(39, 10, 98), Quaternion.fromEulerDegrees(0, -75, 0), Vector3.create(0.3, 0.3, 0.3), 6, 2.05, false)
            this.leaderboard.hide()
        }

        // Party starts in... 7:30-8:00 pm
        new Countdown3d(Date.UTC(2024, 2, 17, 19, 30), 30 * 60, Vector3.create(87.8, 11.4, 103.1), Quaternion.fromEulerDegrees(0, 262.5, 0), Vector3.create(2, 2, 2))
        new Countdown3d(Date.UTC(2024, 2, 17, 19, 30), 30 * 60, Vector3.create(79.5, 11.4, 76.6), Quaternion.fromEulerDegrees(0, -47, 0), Vector3.create(2, 2, 2))

        // Racing ends in... 8:00-8:27 pm
        new Countdown3d(Date.UTC(2024, 2, 17, 20, 0), 27 * 60, Vector3.create(87.8, 11.4, 103.1), Quaternion.fromEulerDegrees(0, 262.5, 0), Vector3.create(2, 2, 2))
        new Countdown3d(Date.UTC(2024, 2, 17, 20, 0), 27 * 60, Vector3.create(79.5, 11.4, 76.6), Quaternion.fromEulerDegrees(0, -47, 0), Vector3.create(2, 2, 2))

        if(!this.bigScreen){
            this.bigScreen = new BigScreen(Vector3.create(85.55, 12.1, 89.17), Quaternion.fromEulerDegrees(0, 287.5, 0), Vector3.create(17.6, 9.8, 2), this.leaderboard)
        }
        this.smallScreens.push(new SmallScreen(Vector3.create(87.85, 12.1, 102.97), Quaternion.fromEulerDegrees(0, 262.5, 0), Vector3.create(8.4, 4.5, 2)))
        this.smallScreens.push(new SmallScreen(Vector3.create(79.5, 12.1, 76.53), Quaternion.fromEulerDegrees(0, -47.5, 0), Vector3.create(8.4, 4.5, 2)))

        // Small screens
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 19, 30, 0),
                Date.UTC(2024, 2, 17, 19, 59, 59),
                () => {
                    this.smallScreens.forEach(screen => {
                        screen.prepareForPartyStart()
                    })
                },
                () => { }
            )
        )

        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 0, 0),
                Date.UTC(2024, 2, 17, 20, 26, 59),
                () => {
                    this.smallScreens.forEach(screen => {
                        screen.prepareForRaceEnd()
                    })
                },
                () => { }
            )
        )

        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 27, 0),
                Date.UTC(2024, 2, 17, 20, 32, 59),
                () => {
                    this.smallScreens.forEach(screen => {
                        screen.triggerWaiting()
                    })
                },
                () => { }
            )
        )

        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 33),
                Date.UTC(2024, 2, 17, 20, 48),
                () => {
                    this.smallScreens.forEach(screen => {
                        screen.triggerCongrats()
                    })
                },
                () => { }
            )
        )

        // Big screen
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 33),
                Date.UTC(2024, 2, 17, 20, 48),
                () => {
                    this.bigScreen.triggerWinningMoment()
                },
                () => {
                }
            )
        )


        // DJ
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                this.djStartTime,
                this.djEndTime,
                () => {
                    this.dj = new DJ()
                    AudioManager.stopAllMusic()
                },
                () => {
                    if (this.dj != undefined) {
                        this.dj.remove()
                    }
                }
            )
        )

        // Ceremony Music
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                this.ceremonyMusicStart,
                this.ceremonyMusicEnd,
                () => {
                    AudioManager.playMusic(5) //Ceremony music
                },
                () => {
                    AudioManager.playMusic(4) //Back to background music
                }
            )
        )

        // Remove 3D race menu
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 1, 14, 11, 50), // Allow racing 10m before event time for testing
                Date.UTC(2024, 2, 17, 20, 27),
                () => {
                    new NPCManager()
                    Scene.LoadMenu()
                },
                () => {
                    Scene.RemoveMenu()
                }
            )
        )

        // 60 seconds of fire works go off between 8.33-8.48 pm
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 33),
                Date.UTC(2024, 2, 17, 20, 47), // -60 secs So the fire works don't overlap with the next bit
                () => {
                    // LAUNCH! pew pew pew
                    this.fireworkManager.startDisplay()
                },
                () => {
                    // It'll end itself.
                }
            )
        )

        // Winner stand npcs
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 33),
                Date.UTC(2024, 2, 18, 20, 33),
                () => {
                    this.podiumNPCs = new PodiumNPCs(this.leaderboard)
                },
                () => {
                    if (this.podiumNPCs != undefined) {
                        this.podiumNPCs.remove()
                    }
                }
            )
        )

        // Leader board
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 0),
                Date.UTC(2024, 2, 17, 20, 45),
                () => {
                    this.leaderboard.show()
                },
                () => {
                    this.leaderboard.hide()
                }
            )
        )

        // Lazer show
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 0),
                Date.UTC(2024, 2, 17, 20, 30),
                () => {
                    this.startLightShow()
                },
                () => {
                    this.endLightShow()
                }
            )
        )
    }

    private startLightShow(): void {
         new dj.Set({
            position: Vector3.create(66, 5, 95),
            rotation: Quaternion.fromEulerDegrees(0, 90, 0),
            scale: Vector3.create(1, 1, 1),

            url: "",
            volume: 1,
            showDJ: false
        });

        const whitelist: string[] = [
            '0x--------------------------1',
            '0x--------------------------2',
            '0x--------------------------3',
        ];
        this.lightingModuleManager = new LightingModuleManager(
            whitelist
        );
    }

    private endLightShow(): void {
        this.lightingModuleManager.end()
    }
}