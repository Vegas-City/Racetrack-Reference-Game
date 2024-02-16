import { GhostData } from "@vegascity/racetrack/src/ghostCar"
import { EnvironmentType } from "./EnvironmentType"
import { Helper, UserData } from "./Helper"
import { RecordAttemptData } from "./types/recordAttemptData"
import { signedFetch } from "~system/SignedFetch"
import { CarData } from "./types/carData"
import { TrackData } from "./types/trackData"
import { PlayerData } from "./types/playerData"
import { LeaderboardData } from "./types/leaderboardData"
import * as examplePlayerData from "./exampleJsons/examplePlayerData.json"
import * as exampleLeaderboardData from "./exampleJsons/exampleLeaderboardData.json"
import { LeaderboardUI } from "../UI/leaderboardUI"
import { TimeUI } from "@vegascity/racetrack/src/ui/timeUI"

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
        //ServerComms.getLeaderboardData()
        ServerComms.getPlayerData()
    }

    public static getServerUrl(): string {
        switch (Helper.getEnvironmentType()) {
            case EnvironmentType.Localhost:
                return `http://localhost:8080`
            case EnvironmentType.Test:
                return `https://uat.vegascity.live/services/racetrack`
            case EnvironmentType.Live:
                return `https://uat.vegascity.live/services/racetrack`
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
                        ServerComms.leaderboard = Object.assign(new LeaderboardData(), data.result)
                    }

                )
            } catch (ex) {
                console.log("Error getting leaderboard data: " + ex)
            }
        }
        LeaderboardUI.update()
    }

    public static async getPlayerData() {
        if (ServerComms.TEST_MODE) {
            ServerComms.player = Object.assign(new PlayerData(), JSON.parse(JSON.stringify(examplePlayerData)))
        }
        else {
            try {
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
                    }

                )
            } catch (ex) {
                console.log("Error getting player data: " + ex)
            }
        }
    }

    static async canClaimWearable(_wearableId:number):Promise<any>{
        let player = UserData.cachedData

        return await signedFetch({
            url:this.getServerUrl() + "/api/missions/canspend",
            init: {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                user: player.publicKey || "GUEST_" + player.userId,
                wearableId: _wearableId,
            })
        }})
    }

    static async claimWearable(_wearableId:number){
        let player = UserData.cachedData

        let response = await signedFetch({
            url: this.getServerUrl() + "/api/missions/spend", 
            init:{
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                user: player.publicKey || "GUEST_" + player.userId,
                wearableId: _wearableId,
            })
        }})
    }

    public static getGhostCarData(_data: TrackData) {
        try {
            signedFetch({
                url: this.getServerUrl() + "/api/racetrack/ghostcardata?trackId=" + _data.guid,
                init: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                }
            }).then(async response => await JSON.parse(response.body)).then(
                data => {
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
                        trackId: _data.track,
                        ghostJson: JSON.stringify({
                            carID: _data.car,
                            createDate: _data.createDate,
                            duration: _data.duration,
                            frequency: _data.frequecy,
                            points: _data.getPointJSON()
                        })
                    })
                }
            })
        } catch (ex) {
            console.log("Error saving ghost data: " + ex)
        }
    }

    public static setTrack(guid:string){
        ServerComms.getPlayerData().then(() => {
            ServerComms.currentTrack = guid
            let track = ServerComms.player.tracks.find(track => track.guid === guid)
            console.log(track)
            let bool = track.pb == 0
            TimeUI.showQualOrPbTime(bool ? "Qualification":"PB", bool ? track.targetTimeToUnlockNextTrack : track.pb)
        })
    }
}