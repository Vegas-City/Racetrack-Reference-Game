import { GhostData } from "@vegascity/racetrack/src/ghostCar"
import { EnvironmentType } from "./EnvironmentType"
import { Helper, UserData } from "./Helper"
import { RecordAttemptData } from "./types/recordAttemptData"
import { signedFetch } from "~system/SignedFetch"
import { CarData } from "./types/carData"
import { TrackData } from "./types/trackData"

export class ServerComms {
    private static readonly TEST_MODE: boolean = true

    constructor() {
        console.log("SERVER COMMS")
        console.log("SC : " + UserData.cachedData?.displayName)
        console.log("SC : " + UserData.cachedData?.publicKey)
        ServerComms.getLeaderboardData()
        ServerComms.getPlayerData()
    }

    public static getServerUrl(): string {
        switch (Helper.getEnvironmentType()) {
            case EnvironmentType.Localhost:
                return `http://localhost:8080`
            case EnvironmentType.Test:
                return `https://racetrackuat.vegascity.cloud`
            case EnvironmentType.Live:
                return `https://racetrack.vegascity.cloud`
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
        try {
            signedFetch({
                url: this.getServerUrl() + "/api/racetrack/leaderboard",
                init: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                }
            }).then(async response => await JSON.parse(response.body)).then(
                data => {
                    console.log(data.result)
                }

            )
        } catch (ex) {
            console.log("Error getting leaderboard data: " + ex)
        }
    }

    public static getPlayerData() {
        try {
            signedFetch({
                url: this.getServerUrl() + "/api/racetrack/player?displayName=" + UserData.cachedData?.displayName,
                init: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                }
            }).then(async response => await JSON.parse(response.body)).then(
                data => {
                    console.log(data.result)
                }

            )
        } catch (ex) {
            console.log("Error getting player data: " + ex)
        }
    }

    public static async makePurchase(_data: CarData) {
        try {
            let response = await signedFetch({
                url: this.getServerUrl() + "/api/racetrack/purchase",
                init: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({
                        guid: _data.guid
                    })
                }
            })
        } catch (ex) {
            console.log("Error make purchase: " + ex)
        }
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
                    console.log(data.result)
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
}