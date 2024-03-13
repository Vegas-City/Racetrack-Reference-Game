import { Entity, Material, MaterialTransparencyMode, MeshRenderer, PBMaterial_PbrMaterial, TextAlignMode, TextShape, Transform, TransformType, engine } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import { ServerComms } from "../Server/serverComms";
import { Helper, UserData } from "../Server/Helper";

export type PlayerScoreData = {
    name: string,
    totalScore: number,
    scores: Map<string, number>
}

export class LeaderboardUI {
    private static readonly MAX_ROWS: number = 5
    private static readonly REFRESH_RATE: number = 5
    private static readonly TEXT_COLOR: Color4 = Color4.White()
    private static readonly MILLI_COLOR: Color4 = Color4.create(0.8, 0.8, 0.8)

    private horizontalSpacing: number = 0
    private verticalSpacing: number = 0
    private leaderboardTransform: TransformType = {
        position: Vector3.Zero(),
        rotation: Quaternion.Identity(),
        scale: Vector3.One()
    }

    private static instances: LeaderboardUI[] = []
    private static elapsed: number = 0

    private hasPlayerData: boolean = true

    private trackNames: string[] = []
    public playerScores = new Map<string, PlayerScoreData>()
    private selfScores = new Map<string, number>()
    private selfRank: number = 0

    private container: Entity | undefined
    private trackNameEntities: Entity[] = []
    private playerNameEntities: Entity[] = []
    private totalTextEntity: Entity | undefined

    private selfScoreContainer: Entity | undefined
    private selfScoreEntities: Entity[] = []
    private selfTotalScoreEntity: Entity | undefined
    private selfScoreMilliEntities: Entity[] = []
    private selfTotalScoreMilliEntity: Entity | undefined
    private selfRankEntity: Entity | undefined
    private youTextEntity: Entity | undefined

    private avatarImageEntity: Entity | undefined
    private playerNameEntity: Entity | undefined
    private playertotalEntity: Entity | undefined
    private playerPointsEntity: Entity | undefined

    private scoreEntities: Entity[][] = []
    private totalScoreEntities: Entity[] = []
    private scoreMilliEntities: Entity[][] = []
    private totalScoreMilliEntities: Entity[] = []

    static update(): void {
        LeaderboardUI.instances.forEach(instance => {
            instance.update()
        })
    }

    constructor(_position: Vector3, _rotation: Quaternion, _scale: Vector3, _horizontalSpacing: number, _verticalSpacing: number, _includePlayerData: boolean = true) {
        this.leaderboardTransform = {
            position: _position,
            rotation: _rotation,
            scale: _scale
        }

        this.horizontalSpacing = _horizontalSpacing
        this.verticalSpacing = _verticalSpacing
        this.hasPlayerData = _includePlayerData

        this.initialise()
    }

    show(): void {
        let transform = Transform.getMutableOrNull(this.container)
        if (transform) {
            transform.scale = this.leaderboardTransform.scale
        }
    }

    hide(): void {
        let transform = Transform.getMutableOrNull(this.container)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }

    private update(): void {
        if (this.container === undefined) {
            this.initialise()
        }

        this.trackNames.splice(0)
        for (let track of ServerComms.leaderboard.result) {
            this.trackNames.push(track.trackName)
        }

        this.updateTopPlayerData()

        // Track names
        let index: number = 0
        for (let track of this.trackNames) {
            if (index < this.trackNameEntities.length) {
                TextShape.getMutable(this.trackNameEntities[index]).text = track.toUpperCase()
            }
            else {
                let nameEntity = engine.addEntity()
                Transform.create(nameEntity, {
                    parent: this.container,
                    position: Vector3.create((this.horizontalSpacing * 1.3) + (index * this.horizontalSpacing), 0, 0)
                })
                TextShape.create(nameEntity, {
                    text: track.toUpperCase(),
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                    outlineWidth: 0.2,
                    textColor: Color4.Black(),
                    outlineColor: Color4.Black()
                })
                this.trackNameEntities.push(nameEntity)
            }
            index++
        }

        // Total text
        if (this.trackNames.length > 0) {
            if (this.totalTextEntity === undefined) {
                this.totalTextEntity = engine.addEntity()
                Transform.create(this.totalTextEntity, {
                    parent: this.container,
                    position: Vector3.create((this.horizontalSpacing * 1.3) + (index * this.horizontalSpacing), 0, 0)
                })
                TextShape.create(this.totalTextEntity, {
                    text: "TOTAL",
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                    outlineWidth: 0.2,
                    textColor: Color4.Black(),
                    outlineColor: Color4.Black()
                })
            }
            else {
                TextShape.getMutable(this.totalTextEntity).text = "TOTAL"
            }
        }
        else {
            if (this.totalTextEntity !== undefined) {
                TextShape.getMutable(this.totalTextEntity).text = ""
            }
        }

        // Player names
        index = 0
        for (let player of this.playerScores.keys()) {
            if (index < this.playerNameEntities.length) {
                TextShape.getMutable(this.playerNameEntities[index]).text = this.playerScores.get(player).name
            }
            else {
                let nameEntity = engine.addEntity()
                Transform.create(nameEntity, {
                    parent: this.container,
                    position: Vector3.create(0, -(this.verticalSpacing * 1.3) - (index * this.verticalSpacing), 0)
                })
                TextShape.create(nameEntity, {
                    text: this.playerScores.get(player).name,
                    textColor: LeaderboardUI.TEXT_COLOR,
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
                this.playerNameEntities.push(nameEntity)
            }
            index++
        }

        // Scores
        index = 0
        for (let track of this.trackNames) {
            if (index >= this.scoreEntities.length) {
                this.scoreEntities.push([])
                this.scoreMilliEntities.push([])
            }

            let subIndex: number = 0
            for (let player of this.playerScores.keys()) {
                if (subIndex < this.scoreEntities[index].length) {
                    TextShape.getMutable(this.scoreEntities[index][subIndex]).text = this.formatTime(this.playerScores.get(player).scores.get(track))
                    TextShape.getMutable(this.scoreMilliEntities[index][subIndex]).text = this.formatTimeMilli(this.playerScores.get(player).scores.get(track))
                }
                else {
                    let scoreEntity = engine.addEntity()
                    Transform.create(scoreEntity, {
                        parent: this.container,
                        position: Vector3.create((this.horizontalSpacing * 1.3) + (index * this.horizontalSpacing), -(this.verticalSpacing * 1.3) - (subIndex * this.verticalSpacing), 0)
                    })
                    TextShape.create(scoreEntity, {
                        text: this.formatTime(this.playerScores.get(player).scores.get(track)),
                        textColor: LeaderboardUI.TEXT_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    this.scoreEntities[index].push(scoreEntity)

                    let scoremilliEntity = engine.addEntity()
                    Transform.create(scoremilliEntity, {
                        parent: this.container,
                        position: Vector3.create((this.horizontalSpacing * 1.3) + (index * this.horizontalSpacing) + 2.8, -(this.verticalSpacing * 1.3) - (subIndex * this.verticalSpacing) - 0.1, 0),
                        scale: Vector3.create(0.7, 0.7, 0.7)
                    })
                    TextShape.create(scoremilliEntity, {
                        text: this.formatTimeMilli(this.playerScores.get(player).scores.get(track)),
                        textColor: LeaderboardUI.MILLI_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    this.scoreMilliEntities[index].push(scoremilliEntity)
                }
                subIndex++
            }
            index++
        }

        // Total Scores
        index = 0
        if (this.trackNames.length > 0) {
            for (let player of this.playerScores.keys()) {
                let totalScore = this.playerScores.get(player).totalScore

                if (index < this.totalScoreEntities.length) {
                    TextShape.getMutable(this.totalScoreEntities[index]).text = this.formatTime(totalScore)
                    TextShape.getMutable(this.totalScoreMilliEntities[index]).text = this.formatTimeMilli(totalScore)
                }
                else {
                    let totalScoreEntity = engine.addEntity()
                    Transform.create(totalScoreEntity, {
                        parent: this.container,
                        position: Vector3.create((this.horizontalSpacing * 1.3) + (this.trackNames.length * this.horizontalSpacing), -(this.verticalSpacing * 1.3) - (index * this.verticalSpacing), 0)
                    })
                    TextShape.create(totalScoreEntity, {
                        text: this.formatTime(totalScore),
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                        outlineWidth: 0.2,
                        textColor: LeaderboardUI.TEXT_COLOR,
                        outlineColor: LeaderboardUI.TEXT_COLOR
                    })
                    this.totalScoreEntities.push(totalScoreEntity)

                    let totalMilliScoreEntity = engine.addEntity()
                    Transform.create(totalMilliScoreEntity, {
                        parent: this.container,
                        position: Vector3.create((this.horizontalSpacing * 1.3) + (this.trackNames.length * this.horizontalSpacing) + 2.8, -(this.verticalSpacing * 1.3) - (index * this.verticalSpacing) - 0.1, 0),
                        scale: Vector3.create(0.7, 0.7, 0.7)
                    })
                    TextShape.create(totalMilliScoreEntity, {
                        text: this.formatTimeMilli(totalScore),
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
                        outlineWidth: 0.2,
                        textColor: LeaderboardUI.MILLI_COLOR,
                        outlineColor: LeaderboardUI.MILLI_COLOR
                    })
                    this.totalScoreMilliEntities.push(totalMilliScoreEntity)
                }
                index++
            }
        }
        else {
            for (let totalScore of this.totalScoreEntities) {
                TextShape.getMutable(totalScore).text = ""
            }
        }

        if (this.hasPlayerData) {
            if (this.avatarImageEntity !== undefined) {
                this.updateAvatar()
            }
        }

        // Self scores data
        if (this.selfScores.size > 0) {
            index = 0
            let selfTotal: number = 0
            for (let track of this.trackNames) {
                if (index < this.selfScoreEntities.length) {
                    TextShape.getMutable(this.selfScoreEntities[index]).text = this.formatTime(this.selfScores.get(track))
                    TextShape.getMutable(this.selfScoreMilliEntities[index]).text = this.formatTimeMilli(this.selfScores.get(track))
                }
                else {
                    let selfScoreEntity = engine.addEntity()
                    Transform.create(selfScoreEntity, {
                        parent: this.selfScoreContainer,
                        position: Vector3.create((this.horizontalSpacing * 1.3) + (index * this.horizontalSpacing), 0, 0)
                    })
                    TextShape.create(selfScoreEntity, {
                        text: this.formatTime(this.selfScores.get(track)),
                        textColor: LeaderboardUI.TEXT_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    this.selfScoreEntities.push(selfScoreEntity)

                    let selfScoreMilliEntity = engine.addEntity()
                    Transform.create(selfScoreMilliEntity, {
                        parent: this.selfScoreContainer,
                        position: Vector3.create((this.horizontalSpacing * 1.3) + (index * this.horizontalSpacing) + 2.8, -0.1, 0),
                        scale: Vector3.create(0.7, 0.7, 0.7)
                    })
                    TextShape.create(selfScoreMilliEntity, {
                        text: this.formatTimeMilli(this.selfScores.get(track)),
                        textColor: LeaderboardUI.MILLI_COLOR,
                        textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                    })
                    this.selfScoreMilliEntities.push(selfScoreMilliEntity)
                }
                selfTotal += this.selfScores.get(track)
                index++
            }

            if (this.selfTotalScoreEntity === undefined) {
                this.selfTotalScoreEntity = engine.addEntity()
                Transform.create(this.selfTotalScoreEntity, {
                    parent: this.selfScoreContainer,
                    position: Vector3.create((this.horizontalSpacing * 1.3) + (this.trackNames.length * this.horizontalSpacing), 0, 0)
                })
                TextShape.create(this.selfTotalScoreEntity, {
                    text: this.formatTime(selfTotal),
                    textColor: LeaderboardUI.TEXT_COLOR,
                    outlineWidth: 0.2,
                    outlineColor: LeaderboardUI.TEXT_COLOR,
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
            }
            else {
                let textShape = TextShape.getMutableOrNull(this.selfTotalScoreEntity)
                if (textShape) {
                    textShape.text = this.formatTime(selfTotal)
                }
            }

            if (this.selfTotalScoreMilliEntity === undefined) {
                this.selfTotalScoreMilliEntity = engine.addEntity()
                Transform.create(this.selfTotalScoreMilliEntity, {
                    parent: this.selfScoreContainer,
                    position: Vector3.create((this.horizontalSpacing * 1.3) + (this.trackNames.length * this.horizontalSpacing) + 2.8, -0.1, 0),
                    scale: Vector3.create(0.7, 0.7, 0.7)
                })
                TextShape.create(this.selfTotalScoreMilliEntity, {
                    text: this.formatTimeMilli(selfTotal),
                    textColor: LeaderboardUI.MILLI_COLOR,
                    outlineWidth: 0.2,
                    outlineColor: LeaderboardUI.MILLI_COLOR,
                    textAlign: TextAlignMode.TAM_MIDDLE_LEFT
                })
            }
            else {
                let textShape = TextShape.getMutableOrNull(this.selfTotalScoreMilliEntity)
                if (textShape) {
                    textShape.text = this.formatTimeMilli(selfTotal)
                }
            }

            let selfRankTextShape = TextShape.getMutableOrNull(this.selfRankEntity)
            if (selfRankTextShape) {
                selfRankTextShape.text = this.selfRank.toString()
            }
        }

        if (this.selfRank > LeaderboardUI.MAX_ROWS) {
            this.showSelfScores()
        }
        else {
            this.hideSelfScores()
        }

        if (this.hasPlayerData) {
            if (this.playerNameEntity !== undefined) {
                let textShape = TextShape.getMutableOrNull(this.playerNameEntity)
                if (textShape) {
                    textShape.text = this.getTruncatedSelfUsername()
                }
            }

            if (this.playertotalEntity !== undefined) {
                let textShape = TextShape.getMutableOrNull(this.playertotalEntity)
                if (textShape) {
                    textShape.text = "Time: " + this.formatPlayerTotal(ServerComms.getPlayerTotalScore())
                }
            }

            if (this.playerPointsEntity !== undefined) {
                let textShape = TextShape.getMutableOrNull(this.playerPointsEntity)
                if (textShape) {
                    textShape.text = "Points: " + ServerComms.player.points.toString()
                }
            }
        }
    }

    private initialise(): void {
        this.container = engine.addEntity()
        Transform.create(this.container, this.leaderboardTransform)

        let bg = engine.addEntity()
        Transform.create(bg, {
            parent: this.container,
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
            parent: this.container,
            position: Vector3.create(0, 0, 0)
        })
        TextShape.create(playerTextEntity, {
            text: "PLAYER",
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
            outlineWidth: 0.2,
            textColor: Color4.Black(),
            outlineColor: Color4.Black()
        })

        if (this.hasPlayerData) {
            this.avatarImageEntity = engine.addEntity()
            Transform.create(this.avatarImageEntity, {
                parent: this.container,
                position: Vector3.create(10, 6, 0),
                scale: Vector3.create(7, 7, 7)
            })
            MeshRenderer.setPlane(this.avatarImageEntity)
            this.updateAvatar()

            this.playerNameEntity = engine.addEntity()
            Transform.create(this.playerNameEntity, {
                parent: this.container,
                position: Vector3.create(22, 8, 0),
                scale: Vector3.create(2, 2, 2)
            })
            TextShape.create(this.playerNameEntity, {
                text: this.getTruncatedSelfUsername(),
                textColor: Color4.Black()
            })

            this.playertotalEntity = engine.addEntity()
            Transform.create(this.playertotalEntity, {
                parent: this.container,
                position: Vector3.create(22, 5.5, 0),
                scale: Vector3.create(1, 1, 1)
            })
            TextShape.create(this.playertotalEntity, {
                text: "Time: N/A",
                fontSize: 16,
                textColor: Color4.Black()
            })

            this.playerPointsEntity = engine.addEntity()
            Transform.create(this.playerPointsEntity, {
                parent: this.container,
                position: Vector3.create(22, 3.5, 0),
                scale: Vector3.create(1, 1, 1)
            })
            TextShape.create(this.playerPointsEntity, {
                text: "Points: 0",
                fontSize: 16,
                textColor: Color4.Black()
            })
        }

        // Rank numbers
        for (let i = 0; i < 5; i++) {
            let rankEntity = engine.addEntity()
            Transform.create(rankEntity, {
                parent: this.container,
                position: Vector3.create(-2, -(this.verticalSpacing * 1.3) - (i * this.verticalSpacing), 0)
            })
            TextShape.create(rankEntity, {
                text: (i + 1).toString(),
                textColor: LeaderboardUI.TEXT_COLOR,
                textAlign: TextAlignMode.TAM_MIDDLE_LEFT
            })
        }

        // Self scores
        this.selfScoreContainer = engine.addEntity()
        Transform.create(this.selfScoreContainer, {
            parent: this.container,
            position: Vector3.create(0, -14, 0)
        })

        this.youTextEntity = engine.addEntity()
        Transform.create(this.youTextEntity, {
            parent: this.selfScoreContainer,
            position: Vector3.create(0, 0, 0)
        })
        TextShape.create(this.youTextEntity, {
            text: "you",
            textColor: LeaderboardUI.TEXT_COLOR,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        this.selfRankEntity = engine.addEntity()
        Transform.create(this.selfRankEntity, {
            parent: this.selfScoreContainer,
            position: Vector3.create(-2, 0, 0)
        })
        TextShape.create(this.selfRankEntity, {
            text: "",
            textColor: LeaderboardUI.TEXT_COLOR,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        let youBg = engine.addEntity()
        Transform.create(youBg, {
            parent: this.selfScoreContainer,
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
        if (LeaderboardUI.instances.length < 1) {
            engine.addSystem((_dt: number) => {
                LeaderboardUI.elapsed += _dt
                if (LeaderboardUI.elapsed >= LeaderboardUI.REFRESH_RATE) {
                    LeaderboardUI.elapsed = 0
                    ServerComms.getLeaderboardData()
                }
            })
        }

        LeaderboardUI.instances.push(this)
    }

    private updateTopPlayerData(): void {
        this.playerScores.clear()
        this.selfScores.clear()
        this.selfRank = 0

        for (let track of ServerComms.leaderboard.result) {
            for (let trackScores of track.scores) {
                if (!this.playerScores.has(trackScores.walletAddress)) {
                    this.playerScores.set(trackScores.walletAddress, {
                        name: trackScores.user.substring(0, 12),
                        totalScore: 0,
                        scores: new Map<string, number>()
                    })
                }
                if (trackScores.walletAddress === this.getSelfWalletAddress()) {
                    this.selfScores.set(track.trackName, trackScores.time)
                }

                let playerScores = this.playerScores.get(trackScores.walletAddress)
                playerScores.scores.set(track.trackName, trackScores.time)
            }
        }

        // filter out players who haven't completed all tracks at least once
        for (let player of this.playerScores.keys()) {
            if (this.playerScores.get(player).scores.size !== this.trackNames.length) {
                this.playerScores.delete(player)
            }
        }

        // sort scores from lowest total to greatest total
        this.playerScores = new Map([...this.playerScores.entries()].sort((a, b) => this.playerScoresSort(a[1].scores, b[1].scores)))

        // take the first MAX_ROWS rows
        let index: number = 0
        for (let player of this.playerScores.keys()) {
            if (player === this.getSelfWalletAddress()) {
                this.selfRank = index + 1
            }
            if (index >= LeaderboardUI.MAX_ROWS) {
                this.playerScores.delete(player)
            }
            index++
        }

        // calculate the total scores per player
        for (let player of this.playerScores.keys()) {
            let totalScore: number = 0
            for (let score of this.playerScores.get(player).scores.keys()) {
                totalScore += this.playerScores.get(player).scores.get(score)
            }
            this.playerScores.get(player).totalScore = totalScore
        }
    }

    private playerScoresSort(_value1: Map<string, number>, _value2: Map<string, number>): number {
        let total1: number = 0
        let total2: number = 0
        for (let track of this.trackNames) {
            total1 += _value1.get(track)
            total2 += _value2.get(track)
        }
        return total1 - total2
    }

    private formatTime(_time: number): string {
        // cap at 99:59
        let roundedTime = Math.floor(Math.min(_time / 1000, 5999))
        let sec = roundedTime % 60
        let min = (roundedTime - sec) / 60

        let secStr = (sec < 10 ? "0" : "") + sec.toString()
        let minStr = (min < 10 ? "0" : "") + min.toString()
        let timeStr = minStr + ":" + secStr
        return timeStr
    }

    private formatTimeMilli(_time: number): string {
        let timeStr = "." + (_time % 1000).toString()
        while (timeStr.length < 4) {
            timeStr += "0"
        }
        return timeStr
    }

    private formatPlayerTotal(_time: number): string {
        if (_time < 1) {
            return "N/A"
        }

        return (this.formatTime(_time) + this.formatTimeMilli(_time)).replace(".", ":");
    }

    private getSelfWalletAddress(): string {
        return UserData.cachedData.publicKey
    }

    private getSelfUsername(): string {
        return UserData.cachedData.displayName.substring(0, UserData.cachedData.displayName.lastIndexOf("#"))
    }

    private getTruncatedSelfUsername(): string {
        let name = this.getSelfUsername()
        return name.length > 12 ? name.substring(0, 12) : name
    }

    private showSelfScores(): void {
        let transform = Transform.getMutableOrNull(this.selfScoreContainer)
        if (transform) {
            transform.scale = Vector3.One()
        }
    }

    private hideSelfScores(): void {
        let transform = Transform.getMutableOrNull(this.selfScoreContainer)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }

    private async updateAvatar(): Promise<void> {
        await this.getAvatarMaterial(UserData.cachedData.publicKey).then(src => {
            Material.setPbrMaterial(this.avatarImageEntity, src)
        })
    }

    private async getAvatarMaterial(_id: string): Promise<PBMaterial_PbrMaterial> {
        try {
            return await ServerComms.getPlayerAvatar(_id).then(avatarSrc => {
                return {
                    texture: Material.Texture.Common({
                        src: avatarSrc ?? ""
                    }),
                    alphaTexture: Material.Texture.Common({
                        src: avatarSrc ?? ""
                    }),
                    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
                    emissiveTexture: Material.Texture.Common({
                        src: avatarSrc ?? ""
                    }),
                    emissiveColor: Color4.White(),
                    emissiveIntensity: 0.5
                }
            })
        } catch (error) {
            return {
                texture: Material.Texture.Common({
                    src: "images/avatarSilhouette.png"
                }),
                alphaTexture: Material.Texture.Common({
                    src: "images/avatarSilhouette.png"
                }),
                transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
                emissiveTexture: Material.Texture.Common({
                    src: "images/avatarSilhouette.png"
                }),
                emissiveColor: Color4.White(),
                emissiveIntensity: 0.5
            }
        }
    }
}