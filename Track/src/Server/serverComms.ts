import { EnvironmentType } from "./EnvironmentType"
import { Helper, UserData } from "./Helper"
import { RecordAttemptData } from "./types/recordAttemptData"

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