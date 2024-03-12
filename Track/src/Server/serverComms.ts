import { GhostData, GhostRecorder } from "@vegascity/racetrack/src/ghostCar"
import { EnvironmentType } from "./EnvironmentType"
import { Helper, UserData } from "./Helper"
import { RecordAttemptData } from "./types/recordAttemptData"
import { signedFetch } from "~system/SignedFetch"
import { PlayerData } from "./types/playerData"
import { LeaderboardData } from "./types/leaderboardData"
import { LeaderboardUI } from "../UI/leaderboardUI"
import { RaceMenuManager } from "../RaceMenu/raceMenuManager"
import { TrackManager } from "@vegascity/racetrack/src/racetrack"
import * as utils from '@dcl-sdk/utils'
import * as examplePlayerData from "./exampleJsons/examplePlayerData.json"
import * as exampleLeaderboardData from "./exampleJsons/exampleLeaderboardData.json"
import { TimeUI } from "@vegascity/racetrack/src/ui"
import { EventUIImage } from "../UI/eventUIImage"
import { CarSpecsMenuManager } from "../CarSpecsMenu/carSpecsMenuManager"
import { ShopMenu } from "../shop/ShopMenu"

export class ServerComms {
    private static readonly TEST_MODE: boolean = false

    static player: PlayerData
    static leaderboard: LeaderboardData
    static currentTrack: string
    static currentCar: string

    constructor() {
        console.log("SERVER COMMS")
        console.log("SC : " + UserData.cachedData?.displayName)
        console.log("SC : " + UserData.cachedData?.publicKey)

        utils.timers.setTimeout(() => {
            ServerComms.getLeaderboardData()
            ServerComms.getPlayerData()
        }, 2000)
    }

    public static getServerUrl(): string {
        switch (Helper.getEnvironmentType()) {
            case EnvironmentType.Localhost:
                return `https://uat.vegascity.live/services/racetrack`
            case EnvironmentType.Test:
                return `https://uat.vegascity.live/services/racetrack`
            case EnvironmentType.Live:
                return `https://production.vegascity.live/services/racetrack`
            default:
                throw Error("Live server URL is not defined")
        }
    }

    public static async recordAttempt(_data: RecordAttemptData) {
        if (ServerComms.TEST_MODE) {
            console.log("Recording attempt:\nCheckpoint: " + _data.checkpoint + "\nTime: " + _data.time)
        }
        else {
            try {
                let response = await signedFetch({
                    url: this.getServerUrl() + "/api/racetrack/checkpoint",
                    init: {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'POST',
                        body: JSON.stringify({
                            car: _data.car,
                            track: _data.track,
                            time: _data.time,
                            checkpoint: _data.checkpoint
                        })
                    }
                })
            } catch (ex) {
                console.log("Error recording attempt: " + ex)
            }
        }
    }

    public static getLeaderboardData() {
        if (ServerComms.TEST_MODE) {
            ServerComms.leaderboard = Object.assign(new LeaderboardData(), JSON.parse(JSON.stringify(exampleLeaderboardData)))
            LeaderboardUI.update()
        }
        else {
            try {
                signedFetch({
                    url: this.getServerUrl() + "/api/racetrack/leaderboard",
                    init: {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'GET'
                    }
                }).then(async response => await JSON.parse(response.body)).then(
                    data => {
                        ServerComms.leaderboard = Object.assign(new LeaderboardData(), data)
                        LeaderboardUI.update()
                    }

                )
            } catch (ex) {
                console.log("Error getting leaderboard data: " + ex)
            }
        }
    }

    public static async getPlayerData(_raceEnded: boolean = false) {
        if (ServerComms.TEST_MODE) {
            ServerComms.player = Object.assign(new PlayerData(), JSON.parse(JSON.stringify(examplePlayerData.result)))
            RaceMenuManager.update()
            CarSpecsMenuManager.update()
        }
        else {
            try {
                if (ServerComms.player != undefined || ServerComms.player != null) {
                    Object.assign(EventUIImage.oldPlayerData, ServerComms.player)
                }
                let response = await signedFetch({
                    url: this.getServerUrl() + "/api/racetrack/player?displayName=" + UserData.cachedData?.displayName,
                    init: {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'GET'
                    }
                }).then(async response => await JSON.parse(response.body)).then(
                    data => {
                        console.log(data.result)
                        ServerComms.player = Object.assign(new PlayerData(), data.result)
                        RaceMenuManager.update()
                        CarSpecsMenuManager.update()
                        if (_raceEnded) {
                            EventUIImage.comparePlayerData()
                        }
                        ShopMenu.items.forEach(wearable => {
                            wearable.unlock(ServerComms.player.points)
                        })
                    }

                )
            } catch (ex) {
                console.log("Error getting player data: " + ex)
            }
        }
    }

    static async canClaimWearable(_wearableId: number): Promise<any> {
        let player = UserData.cachedData

        return await signedFetch({
            url: this.getServerUrl() + "/api/missions/canspend",
            init: {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({
                    user: player.publicKey || "GUEST_" + player.userId,
                    wearableId: _wearableId,
                })
            }
        })
    }

    static async claimWearable(_wearableId: number) {
        let player = UserData.cachedData

        let response = await signedFetch({
            url: this.getServerUrl() + "/api/missions/spend",
            init: {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({
                    user: player.publicKey || "GUEST_" + player.userId,
                    wearableId: _wearableId,
                })
            }
        })
    }

    public static getGhostCarData() {
        try {
            signedFetch({
                url: this.getServerUrl() + "/api/racetrack/ghostcardata?trackId=" + ServerComms.currentTrack,
                init: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                }
            }).then(async response => await JSON.parse(response.body)).then(
                data => {
                    if (data.data == "no data") {
                        // No data to show so clear any previous ghosts  
                        GhostRecorder.instance.clearGhostData()
                        console.log(data)
                    } else {
                        // Load ghost data
                        console.log(data)
                        let trackJs = JSON.parse(data.ghostJson)

                        //use this for the data
                        console.log(trackJs)
                        GhostRecorder.instance.setGhostDataFromServer(trackJs, data.trackId)
                        TrackManager.ghostCar.startGhost()
                    }
                    console.log("Returning Data: " + data)
                }

            )
        } catch (ex) {
            console.log("Error getting ghost data: " + ex)
        }
    }

    public static async sendGhostCarData(_data: GhostData) {
        let publicKey = UserData.cachedData.publicKey || "GUEST_" + UserData.cachedData.userId
        try {
            let response = await signedFetch({
                url: this.getServerUrl() + "/api/racetrack/ghostcardata",
                init: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({
                        userId: publicKey,
                        trackId: ServerComms.currentTrack,
                        ghostJson: JSON.stringify({
                            carID: _data.car,
                            createDate: _data.createDate,
                            duration: _data.duration,
                            frequency: _data.frequency,
                            points: _data.getPointJSON()
                        })
                    })
                }
            })
        } catch (ex) {
            console.log("Error saving ghost data: " + ex)
        }
    }

    public static completePractice() {
        if (ServerComms.TEST_MODE) {
            console.log("Practice completed.")
        }
        else {
            try {
                signedFetch({
                    url: this.getServerUrl() + "/api/racetrack/practice",
                    init: {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'GET'
                    }
                }).then(async response => await JSON.parse(response.body)).then(
                    data => {
                        console.log("Returning Data: " + data)
                    }
                ).then(() => {
                    ServerComms.getPlayerData()
                })
            } catch (ex) {
                console.log("Error getting ghost data: " + ex)
            }
        }
    }

    public static setTrack(_guid: string) {
        ServerComms.getPlayerData().then(() => {
            ServerComms.currentTrack = _guid
            let track = ServerComms.player.tracks.find(track => track.guid === _guid)
            if (track && track.carPbsPerTrack != undefined) {
                let pb = track.carPbsPerTrack.find(car => car.car === ServerComms.currentCar)
                let bool = true;
                if (pb != null) {
                    bool = pb.PB == 0
                }

                if (TrackManager.isPractice) {
                    TimeUI.showQualOrPbTime("Qualification", 50000)
                }
                else {
                    TimeUI.showQualOrPbTime(bool ? "Qualification" : "PB", bool ? track.targetTimeToUnlockNextTrack : track.pb)
                }
            }
        })
    }

    public static getPlayerTotalScore(): number {
        if (ServerComms.player.tracks.length < 4) return 0

        let total: number = 0
        let invalid: boolean = false
        for (let track of ServerComms.player.tracks) {
            if (track.pb < 1) {
                invalid = true
            }
            total += track.pb
        }
        if (invalid) return 0

        return Math.floor(total)
    }
}