import { GhostData } from "@vegascity/racetrack/src/ghostCar"
import { EnvironmentType } from "./EnvironmentType"
import { Helper, UserData } from "./Helper"
import { RecordAttemptData } from "./types/recordAttemptData"
import { signedFetch } from "~system/SignedFetch"

export class ServerComms {
    private static readonly TEST_MODE: boolean = true

    constructor() {
        console.log("SERVER COMMS")
        console.log("SC : " + UserData.cachedData?.displayName)
        console.log("SC : " + UserData.cachedData?.publicKey)
        ServerComms.getLeaderboardData()
    }

    public static getServerUrl(): string {
        switch (Helper.getEnvironmentType()) {
            case EnvironmentType.Localhost:
                return `https://minigamesuat.vegascity.cloud`
            case EnvironmentType.Test:
                return `https://minigamesuat.vegascity.cloud`
            case EnvironmentType.Live:
                return `https://minigames.vegascity.cloud`
            default:
                throw Error("Live server URL is not defined")
        }
    }

    public static recordAttempt(_data: RecordAttemptData): void {
        if (ServerComms.TEST_MODE) {
            console.log("Recording attempt:\nCheckpoint: " + _data.checkpoint + "\nTime: " + _data.time)
        }
        else {

        }
    }

    public static async recordGhostData(_data: GhostData){
        let publicKey = UserData.cachedData.publicKey || "GUEST_" + UserData.cachedData.userId

        try{
            let response = await signedFetch({
                url: ServerComms.getServerUrl() + "racetrack/api/saveghost",
                init: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({
                        walletAddress: publicKey,
                        trackID: _data.track,
                        carID: _data.car,
                        createDate: _data.createDate,
                        duration: _data.duration,
                        frequency: _data.frequecy,
                        points: _data.getPointJSON()
                    })
                }
            })
        } catch(error){
            console.log("Save ghost data error: " + error)
        }
    }

    public static getGhostData() : GhostData{
        // Do something eventually
        return new GhostData()
    }

    public static getLeaderboardData() {
        if (ServerComms.TEST_MODE) {

        }
        else {
            /*
            return executeTask(async () => {
                try {
                    let response = await signedFetch({
                        url: ServerComms.getServerUrl() + "/api/crazygolf/topten?",
                        init: {
                            headers: { "Content-Type": "application/json" },
                            method: "GET"
                        }
                    })
    
                    let json = await JSON.parse(response.body)
                    if (json != null && json != undefined) {
                        console.log(json)
                        
                    } else {
                        //log("Null json returned for Top 10")
                    }
                } catch (error) {
                    console.log("Error " + error)
                }
            })
            */
        }
    }
}