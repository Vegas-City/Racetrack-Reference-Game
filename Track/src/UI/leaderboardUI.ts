import { Entity, Material, MaterialTransparencyMode, MeshRenderer, TextAlignMode, TextShape, Transform, TransformType, engine } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import { ServerComms } from "../Server/serverComms";
import { UserData } from "../Server/Helper";

export class LeaderboardUI {
    private static readonly MAX_ROWS: number = 5
    private static readonly HORIZONTAL_SPACING: number = 6
    private static readonly VERTICAL_SPACING: number = 2.05
    private static readonly REFRESH_RATE: number = 5
    private static readonly TEXT_COLOR: Color4 = Color4.White()
    private static readonly MILLI_COLOR: Color4 = Color4.create(0.9, 0.9, 0.9)

    private static readonly LEADERBOARD_TRANSFORM: TransformType = {
        position: Vector3.create(-46.3, 19, 26.6),
        rotation: Quaternion.fromEulerDegrees(0, -90, 0),
        scale: Vector3.create(0.6, 0.6, 0.6)
    }

    private static elapsed: number = 0

    private static trackNames: string[] = []
    private static playerScores = new Map<string, Map<string, number>>()
    private static selfScores = new Map<string, number>()
    private static selfRank: number = 0

    private static container: Entity | undefined
    private static trackNameEntities: Entity[] = []
    private static playerNameEntities: Entity[] = []
    private static totalTextEntity: Entity | undefined

    private static selfScoreContainer: Entity | undefined
    private static selfScoreEntities: Entity[] = []
    private static selfTotalScoreEntity: Entity | undefined
    private static selfScoreMilliEntities: Entity[] = []
    private static selfTotalScoreMilliEntity: Entity | undefined
    private static selfRankEntity: Entity | undefined
    private static youTextEntity: Entity | undefined

    private static avatarImageEntity: Entity | undefined
    private static playerNameEntity: Entity | undefined
    private static playertotalEntity: Entity | undefined
    private static playerPointsEntity: Entity | undefined

    private static scoreEntities: Entity[][] = []
    private static totalScoreEntities: Entity[] = []
    private static scoreMilliEntities: Entity[][] = []
    private static totalScoreMilliEntities: Entity[] = []

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
                    position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (index * LeaderboardUI.HORIZONTAL_SPACING), 0, 0)
                })
                TextShape.create(nameEntity, {
                    text: track.toUpperCase(),
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                    outlineWidth: 0.2,
                    textColor: Color4.Black(),
                    outlineColor: Color4.Black()
                })
                LeaderboardUI.trackNameEntities.push(nameEntity)
            }
            index++
        }

        // Total text
        if (LeaderboardUI.trackNames.length > 0) {
            if (LeaderboardUI.totalTextEntity === undefined) {
                LeaderboardUI.totalTextEntity = engine.addEntity()
                Transform.create(LeaderboardUI.totalTextEntity, {
                    parent: LeaderboardUI.container,
                    position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (index * LeaderboardUI.HORIZONTAL_SPACING), 0, 0)
                })
                TextShape.create(LeaderboardUI.totalTextEntity, {
                    text: "TOTAL",
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                    outlineWidth: 0.2,
                    textColor: Color4.Black(),
                    outlineColor: Color4.Black()
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
                    position: Vector3.create(0, -(LeaderboardUI.VERTICAL_SPACING * 1.3) - (index * LeaderboardUI.VERTICAL_SPACING), 0)
                })
                TextShape.create(nameEntity, {
                    text: player.substring(0, 12),
                    textColor: LeaderboardUI.TEXT_COLOR,
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
                LeaderboardUI.scoreMilliEntities.push([])
            }

            let subIndex: number = 0
            for (let player of LeaderboardUI.playerScores.keys()) {
                if (subIndex < LeaderboardUI.scoreEntities[index].length) {
                    TextShape.getMutable(LeaderboardUI.scoreEntities[index][subIndex]).text = LeaderboardUI.formatTime(LeaderboardUI.playerScores.get(player).get(track))
                    TextShape.getMutable(LeaderboardUI.scoreMilliEntities[index][subIndex]).text = LeaderboardUI.formatTimeMilli(LeaderboardUI.playerScores.get(player).get(track))
                }
                else {
                    let scoreEntity = engine.addEntity()
                    Transform.create(scoreEntity, {
                        parent: LeaderboardUI.container,
                        position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (index * LeaderboardUI.HORIZONTAL_SPACING), -(LeaderboardUI.VERTICAL_SPACING * 1.3) - (subIndex * LeaderboardUI.VERTICAL_SPACING), 0)
                    })
                    TextShape.create(scoreEntity, {
                        text: LeaderboardUI.formatTime(LeaderboardUI.playerScores.get(player).get(track)),
                        textColor: LeaderboardUI.TEXT_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    LeaderboardUI.scoreEntities[index].push(scoreEntity)

                    let scoremilliEntity = engine.addEntity()
                    Transform.create(scoremilliEntity, {
                        parent: LeaderboardUI.container,
                        position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (index * LeaderboardUI.HORIZONTAL_SPACING) + 2.8, -(LeaderboardUI.VERTICAL_SPACING * 1.3) - (subIndex * LeaderboardUI.VERTICAL_SPACING) - 0.1, 0),
                        scale: Vector3.create(0.7, 0.7, 0.7)
                    })
                    TextShape.create(scoremilliEntity, {
                        text: LeaderboardUI.formatTimeMilli(LeaderboardUI.playerScores.get(player).get(track)),
                        textColor: LeaderboardUI.MILLI_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    LeaderboardUI.scoreMilliEntities[index].push(scoremilliEntity)
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
                    TextShape.getMutable(LeaderboardUI.totalScoreMilliEntities[index]).text = LeaderboardUI.formatTimeMilli(totalScore)
                }
                else {
                    let totalScoreEntity = engine.addEntity()
                    Transform.create(totalScoreEntity, {
                        parent: LeaderboardUI.container,
                        position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (LeaderboardUI.trackNames.length * LeaderboardUI.HORIZONTAL_SPACING), -(LeaderboardUI.VERTICAL_SPACING * 1.3) - (index * LeaderboardUI.VERTICAL_SPACING), 0)
                    })
                    TextShape.create(totalScoreEntity, {
                        text: LeaderboardUI.formatTime(totalScore),
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                        outlineWidth: 0.2,
                        textColor: LeaderboardUI.TEXT_COLOR,
                        outlineColor: LeaderboardUI.TEXT_COLOR
                    })
                    LeaderboardUI.totalScoreEntities.push(totalScoreEntity)

                    let totalMilliScoreEntity = engine.addEntity()
                    Transform.create(totalMilliScoreEntity, {
                        parent: LeaderboardUI.container,
                        position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (LeaderboardUI.trackNames.length * LeaderboardUI.HORIZONTAL_SPACING) + 2.8, -(LeaderboardUI.VERTICAL_SPACING * 1.3) - (index * LeaderboardUI.VERTICAL_SPACING) - 0.1, 0),
                        scale: Vector3.create(0.7, 0.7, 0.7)
                    })
                    TextShape.create(totalMilliScoreEntity, {
                        text: LeaderboardUI.formatTimeMilli(totalScore),
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                        outlineWidth: 0.2,
                        textColor: LeaderboardUI.MILLI_COLOR,
                        outlineColor: LeaderboardUI.MILLI_COLOR
                    })
                    LeaderboardUI.totalScoreMilliEntities.push(totalMilliScoreEntity)
                }
                index++
            }
        }
        else {
            for (let totalScore of LeaderboardUI.totalScoreEntities) {
                TextShape.getMutable(totalScore).text = ""
            }
        }

        // Self data
        if (LeaderboardUI.avatarImageEntity !== undefined) {
            Material.setPbrMaterial(LeaderboardUI.avatarImageEntity, {
                texture: Material.Texture.Avatar({
                    userId: UserData.cachedData.publicKey,
                }),
                alphaTexture: Material.Texture.Avatar({
                    userId: UserData.cachedData.publicKey,
                }),
                transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
                emissiveTexture: Material.Texture.Avatar({
                    userId: UserData.cachedData.publicKey,
                }),
                emissiveColor: Color4.Black(),
                emissiveIntensity: 0.5
            })
        }

        // Self scores data
        if (LeaderboardUI.selfScores.size > 0) {
            index = 0
            let selfTotal: number = 0
            for (let track of LeaderboardUI.trackNames) {
                if (index < LeaderboardUI.selfScoreEntities.length) {
                    TextShape.getMutable(LeaderboardUI.selfScoreEntities[index]).text = LeaderboardUI.formatTime(LeaderboardUI.selfScores.get(track))
                    TextShape.getMutable(LeaderboardUI.selfScoreMilliEntities[index]).text = LeaderboardUI.formatTimeMilli(LeaderboardUI.selfScores.get(track))
                }
                else {
                    let selfScoreEntity = engine.addEntity()
                    Transform.create(selfScoreEntity, {
                        parent: LeaderboardUI.selfScoreContainer,
                        position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (index * LeaderboardUI.HORIZONTAL_SPACING), 0, 0)
                    })
                    TextShape.create(selfScoreEntity, {
                        text: LeaderboardUI.formatTime(LeaderboardUI.selfScores.get(track)),
                        textColor: LeaderboardUI.TEXT_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    LeaderboardUI.selfScoreEntities.push(selfScoreEntity)

                    let selfScoreMilliEntity = engine.addEntity()
                    Transform.create(selfScoreMilliEntity, {
                        parent: LeaderboardUI.selfScoreContainer,
                        position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (index * LeaderboardUI.HORIZONTAL_SPACING) + 2.8, -0.1, 0),
                        scale: Vector3.create(0.7, 0.7, 0.7)
                    })
                    TextShape.create(selfScoreMilliEntity, {
                        text: LeaderboardUI.formatTimeMilli(LeaderboardUI.selfScores.get(track)),
                        textColor: LeaderboardUI.MILLI_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    LeaderboardUI.selfScoreMilliEntities.push(selfScoreMilliEntity)
                }
                selfTotal += LeaderboardUI.selfScores.get(track)
                index++
            }

            if (LeaderboardUI.selfTotalScoreEntity === undefined) {
                LeaderboardUI.selfTotalScoreEntity = engine.addEntity()
                Transform.create(LeaderboardUI.selfTotalScoreEntity, {
                    parent: LeaderboardUI.selfScoreContainer,
                    position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (LeaderboardUI.trackNames.length * LeaderboardUI.HORIZONTAL_SPACING), 0, 0)
                })
                TextShape.create(LeaderboardUI.selfTotalScoreEntity, {
                    text: LeaderboardUI.formatTime(selfTotal),
                    textColor: LeaderboardUI.TEXT_COLOR,
                    outlineWidth: 0.2,
                    outlineColor: LeaderboardUI.TEXT_COLOR,
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
            }
            else {
                let textShape = TextShape.getMutableOrNull(LeaderboardUI.selfTotalScoreEntity)
                if (textShape) {
                    textShape.text = LeaderboardUI.formatTime(selfTotal)
                }
            }

            if (LeaderboardUI.selfTotalScoreMilliEntity === undefined) {
                LeaderboardUI.selfTotalScoreMilliEntity = engine.addEntity()
                Transform.create(LeaderboardUI.selfTotalScoreMilliEntity, {
                    parent: LeaderboardUI.selfScoreContainer,
                    position: Vector3.create((LeaderboardUI.HORIZONTAL_SPACING * 1.3) + (LeaderboardUI.trackNames.length * LeaderboardUI.HORIZONTAL_SPACING) + 2.8, -0.1, 0),
                    scale: Vector3.create(0.7, 0.7, 0.7)
                })
                TextShape.create(LeaderboardUI.selfTotalScoreMilliEntity, {
                    text: LeaderboardUI.formatTimeMilli(selfTotal),
                    textColor: LeaderboardUI.MILLI_COLOR,
                    outlineWidth: 0.2,
                    outlineColor: LeaderboardUI.MILLI_COLOR,
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
            }
            else {
                let textShape = TextShape.getMutableOrNull(LeaderboardUI.selfTotalScoreMilliEntity)
                if (textShape) {
                    textShape.text = LeaderboardUI.formatTimeMilli(selfTotal)
                }
            }

            let selfRankTextShape = TextShape.getMutableOrNull(LeaderboardUI.selfRankEntity)
            if (selfRankTextShape) {
                selfRankTextShape.text = LeaderboardUI.selfRank.toString()
            }
        }

        if (LeaderboardUI.selfRank > LeaderboardUI.MAX_ROWS) {
            LeaderboardUI.showSelfScores()
        }
        else {
            LeaderboardUI.hideSelfScores()
        }

        if (LeaderboardUI.playerNameEntity !== undefined) {
            let textShape = TextShape.getMutableOrNull(LeaderboardUI.playerNameEntity)
            if (textShape) {
                textShape.text = LeaderboardUI.getTruncatedSelfUsername()
            }
        }

        if (LeaderboardUI.playertotalEntity !== undefined) {
            let textShape = TextShape.getMutableOrNull(LeaderboardUI.playertotalEntity)
            if (textShape) {
                textShape.text = "Time: " + LeaderboardUI.formatPlayerTotal(ServerComms.getPlayerTotalScore())
            }
        }

        if (LeaderboardUI.playerPointsEntity !== undefined) {
            let textShape = TextShape.getMutableOrNull(LeaderboardUI.playerPointsEntity)
            if (textShape) {
                textShape.text = "Points: " + ServerComms.player.points.toString()
            }
        }
    }

    private static initialise(): void {
        LeaderboardUI.container = engine.addEntity()
        Transform.create(LeaderboardUI.container, LeaderboardUI.LEADERBOARD_TRANSFORM)

        let bg = engine.addEntity()
        Transform.create(bg, {
            parent: LeaderboardUI.container,
            position: Vector3.create(16.8, -6.6, 0.1),
            scale: Vector3.create(42, 12.5, 1)
        })
        MeshRenderer.setPlane(bg)
        Material.setPbrMaterial(bg, {
            texture: Material.Texture.Common({
                src: 'images/leaderboardBG.png'
            }),
            alphaTexture: Material.Texture.Common({
                src: 'images/leaderboardBG.png'
            }),
            emissiveTexture: Material.Texture.Common({
                src: 'images/leaderboardBG.png'
            }),
            transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        })

        let playerTextEntity = engine.addEntity()
        Transform.create(playerTextEntity, {
            parent: LeaderboardUI.container,
            position: Vector3.create(0, 0, 0)
        })
        TextShape.create(playerTextEntity, {
            text: "PLAYER",
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
            outlineWidth: 0.2,
            textColor: Color4.Black(),
            outlineColor: Color4.Black()
        })

        LeaderboardUI.avatarImageEntity = engine.addEntity()
        Transform.create(LeaderboardUI.avatarImageEntity, {
            parent: LeaderboardUI.container,
            position: Vector3.create(10, 6, 0),
            scale: Vector3.create(7, 7, 7)
        })
        MeshRenderer.setPlane(LeaderboardUI.avatarImageEntity)
        Material.setPbrMaterial(LeaderboardUI.avatarImageEntity, {
            texture: Material.Texture.Avatar({
                userId: UserData.cachedData.publicKey,
            }),
            emissiveTexture: Material.Texture.Avatar({
                userId: UserData.cachedData.publicKey,
            }),
            emissiveColor: Color4.White(),
            emissiveIntensity: 0.5
        })

        LeaderboardUI.playerNameEntity = engine.addEntity()
        Transform.create(LeaderboardUI.playerNameEntity, {
            parent: LeaderboardUI.container,
            position: Vector3.create(22, 8, 0),
            scale: Vector3.create(2, 2, 2)
        })
        TextShape.create(LeaderboardUI.playerNameEntity, {
            text: LeaderboardUI.getTruncatedSelfUsername(),
            textColor: Color4.Black()
        })

        LeaderboardUI.playertotalEntity = engine.addEntity()
        Transform.create(LeaderboardUI.playertotalEntity, {
            parent: LeaderboardUI.container,
            position: Vector3.create(22, 5.5, 0),
            scale: Vector3.create(1, 1, 1)
        })
        TextShape.create(LeaderboardUI.playertotalEntity, {
            text: "Time: N/A",
            fontSize: 16,
            textColor: Color4.Black()
        })

        LeaderboardUI.playerPointsEntity = engine.addEntity()
        Transform.create(LeaderboardUI.playerPointsEntity, {
            parent: LeaderboardUI.container,
            position: Vector3.create(22, 3.5, 0),
            scale: Vector3.create(1, 1, 1)
        })
        TextShape.create(LeaderboardUI.playerPointsEntity, {
            text: "Points: 0",
            fontSize: 16,
            textColor: Color4.Black()
        })

        // Rank numbers
        for (let i = 0; i < 5; i++) {
            let rankEntity = engine.addEntity()
            Transform.create(rankEntity, {
                parent: LeaderboardUI.container,
                position: Vector3.create(-2, -(LeaderboardUI.VERTICAL_SPACING * 1.3) - (i * LeaderboardUI.VERTICAL_SPACING), 0)
            })
            TextShape.create(rankEntity, {
                text: (i + 1).toString(),
                textColor: LeaderboardUI.TEXT_COLOR,
                textAlign: TextAlignMode.TAM_MIDDLE_LEFT
            })
        }

        // Self scores
        LeaderboardUI.selfScoreContainer = engine.addEntity()
        Transform.create(LeaderboardUI.selfScoreContainer, {
            parent: LeaderboardUI.container,
            position: Vector3.create(0, -14, 0)
        })

        LeaderboardUI.youTextEntity = engine.addEntity()
        Transform.create(LeaderboardUI.youTextEntity, {
            parent: LeaderboardUI.selfScoreContainer,
            position: Vector3.create(0, 0, 0)
        })
        TextShape.create(LeaderboardUI.youTextEntity, {
            text: "you",
            textColor: LeaderboardUI.TEXT_COLOR,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        LeaderboardUI.selfRankEntity = engine.addEntity()
        Transform.create(LeaderboardUI.selfRankEntity, {
            parent: LeaderboardUI.selfScoreContainer,
            position: Vector3.create(-2, 0, 0)
        })
        TextShape.create(LeaderboardUI.selfRankEntity, {
            text: "",
            textColor: LeaderboardUI.TEXT_COLOR,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        let youBg = engine.addEntity()
        Transform.create(youBg, {
            parent: LeaderboardUI.selfScoreContainer,
            position: Vector3.create(16.8, 0, 0.1),
            scale: Vector3.create(42, 6, 1)
        })
        MeshRenderer.setPlane(youBg)
        Material.setPbrMaterial(youBg, {
            texture: Material.Texture.Common({
                src: 'images/leaderboardBG_you.png'
            }),
            alphaTexture: Material.Texture.Common({
                src: 'images/leaderboardBG_you.png'
            }),
            emissiveTexture: Material.Texture.Common({
                src: 'images/leaderboardBG_you.png'
            }),
            transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        })


        // Refresh system
        engine.addSystem((_dt: number) => {
            LeaderboardUI.elapsed += _dt
            if (LeaderboardUI.elapsed >= LeaderboardUI.REFRESH_RATE) {
                LeaderboardUI.elapsed = 0
                ServerComms.getLeaderboardData()
            }
        })
    }

    private static updateTopPlayerData(): void {
        LeaderboardUI.playerScores.clear()
        LeaderboardUI.selfScores.clear()
        LeaderboardUI.selfRank = 0

        for (let track of ServerComms.leaderboard.result) {
            for (let trackScores of track.scores) {
                if (!LeaderboardUI.playerScores.has(trackScores.user)) {
                    LeaderboardUI.playerScores.set(trackScores.user, new Map<string, number>())
                }
                if (trackScores.user === LeaderboardUI.getSelfUsername()) {
                    LeaderboardUI.selfScores.set(track.trackName, trackScores.time)
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
            if (player === LeaderboardUI.getSelfUsername()) {
                LeaderboardUI.selfRank = index + 1
            }
            if (index >= LeaderboardUI.MAX_ROWS) {
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
        let roundedTime = Math.floor(Math.min(_time / 1000, 5999))
        let sec = roundedTime % 60
        let min = (roundedTime - sec) / 60

        let secStr = (sec < 10 ? "0" : "") + sec.toString()
        let minStr = (min < 10 ? "0" : "") + min.toString()
        let timeStr = minStr + ":" + secStr
        return timeStr
    }

    private static formatTimeMilli(_time: number): string {
        let timeStr = "." + (_time % 1000).toString()
        while (timeStr.length < 4) {
            timeStr += "0"
        }
        return timeStr
    }

    private static formatPlayerTotal(_time: number): string {
        if (_time < 1) {
            return "N/A"
        }

        return (LeaderboardUI.formatTime(_time) + LeaderboardUI.formatTimeMilli(_time)).replace(".", ":");
    }

    private static getSelfUsername(): string {
        return UserData.cachedData.displayName.substring(0, UserData.cachedData.displayName.lastIndexOf("#"))
    }

    private static getTruncatedSelfUsername(): string {
        let name = LeaderboardUI.getSelfUsername()
        return name.length > 12 ? name.substring(0, 12) : name
    }

    private static showSelfScores(): void {
        let transform = Transform.getMutableOrNull(LeaderboardUI.selfScoreContainer)
        if (transform) {
            transform.scale = Vector3.One()
        }
    }

    private static hideSelfScores(): void {
        let transform = Transform.getMutableOrNull(LeaderboardUI.selfScoreContainer)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }
}