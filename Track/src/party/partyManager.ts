import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { LeaderboardUI } from "../UI/leaderboardUI";
import { DJ } from "./dj";
import { Schedule, ScheduleManager } from "./scheduleManager";
import { Countdown3d } from "../UI/countdown3d";
import { PodiumNPCs } from "./podiumNPC";

export class PartyManager {
    dj: DJ
    leaderboard: LeaderboardUI
    podiumNPCs: PodiumNPCs

    constructor() {
        this.leaderboard = new LeaderboardUI(Vector3.create(39, 10, 98), Quaternion.fromEulerDegrees(0, -75, 0), Vector3.create(0.3, 0.3, 0.3), 6, 2.05, false)
        this.leaderboard.hide()

        // Party starts in... 7:30-8:00 pm
        new Countdown3d(new Date('2024-03-17T19:30:00'), 30 * 60, Vector3.create(87.8, 12.1, 103.1), Quaternion.fromEulerDegrees(0, 262.5, 0), Vector3.create(2, 2, 2))
        new Countdown3d(new Date('2024-03-17T19:30:00'), 30 * 60, Vector3.create(79.5, 12.1, 76.6), Quaternion.fromEulerDegrees(0, -47, 0), Vector3.create(2, 2, 2))
        
        // Racing ends in... 8:00-8:27 pm
        new Countdown3d(new Date('2024-03-17T20:00:00'), 27 * 60, Vector3.create(87.8, 12.1, 103.1), Quaternion.fromEulerDegrees(0, 262.5, 0), Vector3.create(2, 2, 2))
        new Countdown3d(new Date('2024-03-17T20:00:00'), 27 * 60, Vector3.create(79.5, 12.1, 76.6), Quaternion.fromEulerDegrees(0, -47, 0), Vector3.create(2, 2, 2))

        // DJ
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 0),
                Date.UTC(2024, 2, 17, 20, 30),
                () => {
                    this.dj = new DJ()
                },
                () => {
                    if (this.dj != undefined) {
                        this.dj.remove()
                    }
                }
            )
        )

        // Leader board + winner stand npcs
        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024, 2, 17, 20, 0),
                Date.UTC(2024, 2, 17, 20, 45),
                () => {
                    this.leaderboard.show()
                    this.podiumNPCs = new PodiumNPCs()
                },
                () => {
                    this.leaderboard.hide()
                    if (this.podiumNPCs != undefined) {
                        this.podiumNPCs.remove()
                    }
                }
            )
        )
    }
}