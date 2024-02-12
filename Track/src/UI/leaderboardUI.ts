import { Entity, TextAlignMode, TextShape, Transform, TransformType, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { ServerComms } from "../Server/serverComms";

export class LeaderboardUI {
    private static readonly MAX_ROWS: number = 10
    private static readonly HORIZONTAL_SPACING: number = 8
    private static readonly VERTICAL_SPACING: number = 1.5

    private static readonly LEADERBOARD_TRANSFORM: TransformType = {
        position: Vector3.create(16, 4, 15),
        rotation: Quaternion.fromEulerDegrees(0, 90, 0),
        scale: Vector3.create(0.3, 0.3, 0.3)
    }

    private static trackNames: string[] = []
    private static playerScores = new Map<string, Map<string, number>>()

    private static container: Entity | undefined
    private static trackNameEntities: Entity[] = []
    private static playerNameEntities: Entity[] = []
    private static totalTextEntity: Entity | undefined

    private static scoreEntities: Entity[][] = []
    private static totalScoreEntities: Entity[] = []

    static update(): void {
        if (LeaderboardUI.container === undefined) {
            LeaderboardUI.initialise()
        }

        LeaderboardUI.trackNames.splice(0)
        for (let track of ServerComms.leaderboard.result) {
            LeaderboardUI.trackNames.push(track.trackName)
        }

        LeaderboardUI.updateTopPlayerData()

        // Track names
        let index: number = 0
        for (let track of LeaderboardUI.trackNames) {
            if (index < LeaderboardUI.trackNameEntities.length) {
                TextShape.getMutable(LeaderboardUI.trackNameEntities[index]).text = track.toUpperCase()
            }
            else {
                let nameEntity = engine.addEntity()
                Transform.create(nameEntity, {
                    parent: LeaderboardUI.container,
                    position: Vector3.create(LeaderboardUI.HORIZONTAL_SPACING + (index * LeaderboardUI.HORIZONTAL_SPACING), 0, 0)
                })
                TextShape.create(nameEntity, {
                    text: track.toUpperCase(),
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
                LeaderboardUI.trackNameEntities.push(nameEntity)
            }
            index++
        }

        // Total text
        if (LeaderboardUI.trackNames.length > 0) {
            if (LeaderboardUI.totalTextEntity === undefined) {
                Transform.create(LeaderboardUI.totalTextEntity, {
                    parent: LeaderboardUI.container,
                    position: Vector3.create(LeaderboardUI.HORIZONTAL_SPACING + (index * LeaderboardUI.HORIZONTAL_SPACING), 0, 0)
                })
                TextShape.create(LeaderboardUI.totalTextEntity, {
                    text: "TOTAL",
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
            }
            else {
                TextShape.getMutable(LeaderboardUI.totalTextEntity).text = "TOTAL"
            }
        }
        else {
            if (LeaderboardUI.totalTextEntity !== undefined) {
                TextShape.getMutable(LeaderboardUI.totalTextEntity).text = ""
            }
        }


        // Player names
        index = 0
        for (let player of LeaderboardUI.playerScores.keys()) {
            if (index < LeaderboardUI.playerNameEntities.length) {
                TextShape.getMutable(LeaderboardUI.playerNameEntities[index]).text = player.substring(0, 12)
            }
            else {
                let nameEntity = engine.addEntity()
                Transform.create(nameEntity, {
                    parent: LeaderboardUI.container,
                    position: Vector3.create(0, -LeaderboardUI.VERTICAL_SPACING - (index * LeaderboardUI.VERTICAL_SPACING), 0)
                })
                TextShape.create(nameEntity, {
                    text: player.substring(0, 12),
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
                LeaderboardUI.playerNameEntities.push(nameEntity)
            }
            index++
        }

        // Scores
        index = 0
        for (let track of LeaderboardUI.trackNames) {
            if (index >= LeaderboardUI.scoreEntities.length) {
                LeaderboardUI.scoreEntities.push([])
            }

            let subIndex: number = 0
            for (let player of LeaderboardUI.playerScores.keys()) {
                if (subIndex < LeaderboardUI.scoreEntities[index].length) {
                    TextShape.getMutable(LeaderboardUI.scoreEntities[index][subIndex]).text = LeaderboardUI.formatTime(LeaderboardUI.playerScores.get(player).get(track))
                }
                else {
                    let scoreEntity = engine.addEntity()
                    Transform.create(scoreEntity, {
                        parent: LeaderboardUI.container,
                        position: Vector3.create(LeaderboardUI.HORIZONTAL_SPACING + (index * LeaderboardUI.HORIZONTAL_SPACING), -LeaderboardUI.VERTICAL_SPACING - (subIndex * LeaderboardUI.VERTICAL_SPACING), 0)
                    })
                    TextShape.create(scoreEntity, {
                        text: LeaderboardUI.formatTime(LeaderboardUI.playerScores.get(player).get(track)),
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    LeaderboardUI.scoreEntities[index].push(scoreEntity)
                }
                subIndex++
            }
            index++
        }

        // Total Scores
        index = 0
        if (LeaderboardUI.trackNames.length > 0) {
            for (let player of LeaderboardUI.playerScores.keys()) {
                let totalScore: number = 0
                for (let score of LeaderboardUI.playerScores.get(player).keys()) {
                    totalScore += LeaderboardUI.playerScores.get(player).get(score)
                }

                if (index < LeaderboardUI.totalScoreEntities.length) {
                    TextShape.getMutable(LeaderboardUI.totalScoreEntities[index]).text = LeaderboardUI.formatTime(totalScore)
                }
                else {
                    let totalScoreEntity = engine.addEntity()
                    Transform.create(totalScoreEntity, {
                        parent: LeaderboardUI.container,
                        position: Vector3.create(LeaderboardUI.HORIZONTAL_SPACING + (LeaderboardUI.trackNames.length * LeaderboardUI.HORIZONTAL_SPACING), -LeaderboardUI.VERTICAL_SPACING - (index * LeaderboardUI.VERTICAL_SPACING), 0)
                    })
                    TextShape.create(totalScoreEntity, {
                        text: LeaderboardUI.formatTime(totalScore),
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    LeaderboardUI.totalScoreEntities.push(totalScoreEntity)
                }
                index++
            }
        }
        else {
            for (let totalScore of LeaderboardUI.totalScoreEntities) {
                TextShape.getMutable(totalScore).text = ""
            }
        }
    }

    private static initialise(): void {
        LeaderboardUI.container = engine.addEntity()
        Transform.create(LeaderboardUI.container, LeaderboardUI.LEADERBOARD_TRANSFORM)

        let playerTextEntity = engine.addEntity()
        Transform.create(playerTextEntity, {
            parent: LeaderboardUI.container,
            position: Vector3.create(0, 0, 0)
        })
        TextShape.create(playerTextEntity, {
            text: "PLAYER",
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })
    }

    private static updateTopPlayerData(): void {
        LeaderboardUI.playerScores.clear()

        for (let track of ServerComms.leaderboard.result) {
            for (let trackScores of track.scores) {
                if (!LeaderboardUI.playerScores.has(trackScores.user)) {
                    LeaderboardUI.playerScores.set(trackScores.user, new Map<string, number>())
                }

                let playerScores = LeaderboardUI.playerScores.get(trackScores.user)
                playerScores.set(track.trackName, trackScores.time)
            }
        }

        // filter out players who haven't completed all tracks at least once
        for (let player of LeaderboardUI.playerScores.keys()) {
            if (LeaderboardUI.playerScores.get(player).size !== LeaderboardUI.trackNames.length) {
                LeaderboardUI.playerScores.delete(player)
            }
        }

        // sort scores from lowest total to greatest total
        LeaderboardUI.playerScores = new Map([...LeaderboardUI.playerScores.entries()].sort((a, b) => LeaderboardUI.playerScoresSort(a[1], b[1])))

        // take the first MAX_ROWS rows
        let index: number = 0
        for (let player of LeaderboardUI.playerScores.keys()) {
            if (index > LeaderboardUI.MAX_ROWS) {
                LeaderboardUI.playerScores.delete(player)
            }
            index++
        }
    }

    private static playerScoresSort(_value1: Map<string, number>, _value2: Map<string, number>): number {
        let total1: number = 0
        let total2: number = 0
        for (let track of LeaderboardUI.trackNames) {
            total1 += _value1.get(track)
            total2 += _value2.get(track)
        }
        return total1 - total2
    }

    private static formatTime(_time: number): string {
        // cap at 99:59
        let roundedTime = Math.round(Math.min(_time / 1000, 5999))
        let sec = roundedTime % 60
        let min = (roundedTime - sec) / 60

        let secStr = (sec < 10 ? "0" : "") + sec.toString()
        let minStr = (min < 10 ? "0" : "") + min.toString()
        let timeStr = minStr + ":" + secStr
        return timeStr
    }
}