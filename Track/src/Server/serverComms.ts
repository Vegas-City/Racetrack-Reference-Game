import { EnvironmentType } from "@vegascity/vegas-city-library/src/core/EnvironmentType"
import { Helper, UserData } from "@vegascity/vegas-city-library/src/core/Helper"
import { signedFetch } from "~system/SignedFetch"
import { executeTask } from "@dcl/sdk/ecs"
import { RecordAttemptData } from "./types/recordAttemptData"

export class ServerComms {
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
        console.log("recording attempt")
    }

    public static getLeaderboardData() {
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
    }
}