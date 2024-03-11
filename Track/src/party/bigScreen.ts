import { Entity, Material, MaterialTransparencyMode, MeshRenderer, PBMaterial_PbrMaterial, TextShape, Transform, engine } from "@dcl/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math";
import { LeaderboardUI } from "../UI/leaderboardUI";
import { UserData } from "../Server/Helper";

export class BigScreen {
    private static readonly REFRESH_TIME: number = 5

    scale: Vector3
    entity: Entity

    player1Container: Entity
    player2Container: Entity
    player3Container: Entity

    avatar1: Entity
    avatar2: Entity
    avatar3: Entity

    name1: Entity
    name2: Entity
    name3: Entity

    time1: Entity
    time2: Entity
    time3: Entity

    leaderboard: LeaderboardUI
    elapsed: number = 0

    constructor(_pos: Vector3, _rot: Quaternion, _scale: Vector3, _leaderboard: LeaderboardUI) {
        this.leaderboard = _leaderboard
        this.scale = Vector3.clone(_scale)

        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            position: _pos,
            rotation: Quaternion.multiply(_rot, Quaternion.fromEulerDegrees(0, 180, 0)),
            scale: _scale
        })

        MeshRenderer.setPlane(this.entity)
        Material.setPbrMaterial(this.entity, this.getOffMaterial())

        this.player1Container = engine.addEntity()
        Transform.create(this.player1Container, {
            parent: this.entity,
            position: Vector3.create(0, 0.2, -0.05),
            scale: Vector3.create(1 / _scale.x, 1 / _scale.y, 1 / _scale.z)
        })

        this.player2Container = engine.addEntity()
        Transform.create(this.player2Container, {
            parent: this.entity,
            position: Vector3.create(-0.3, 0, -0.05),
            scale: Vector3.create(1 / _scale.x, 1 / _scale.y, 1 / _scale.z)
        })

        this.player3Container = engine.addEntity()
        Transform.create(this.player3Container, {
            parent: this.entity,
            position: Vector3.create(0.3, 0, -0.05),
            scale: Vector3.create(1 / _scale.x, 1 / _scale.y, 1 / _scale.z)
        })

        this.avatar1 = engine.addEntity()
        Transform.create(this.avatar1, {
            parent: this.player1Container,
            position: Vector3.create(-0.3, 0, 0)
        })

        this.name1 = engine.addEntity()
        Transform.create(this.name1, {
            parent: this.player1Container,
            position: Vector3.create(0, 0.55, 0)
        })
        TextShape.create(this.name1, {
            text: ""
        })

        this.time1 = engine.addEntity()
        Transform.create(this.time1, {
            parent: this.player1Container,
            position: Vector3.create(0, -0.55, 0)
        })
        TextShape.create(this.time1, {
            text: ""
        })

        this.avatar2 = engine.addEntity()
        Transform.create(this.avatar2, {
            parent: this.player2Container,
            position: Vector3.create(-0.3, 0, 0)
        })

        this.name2 = engine.addEntity()
        Transform.create(this.name2, {
            parent: this.player2Container,
            position: Vector3.create(0, 0.55, 0)
        })
        TextShape.create(this.name2, {
            text: ""
        })

        this.time2 = engine.addEntity()
        Transform.create(this.time2, {
            parent: this.player2Container,
            position: Vector3.create(0, -0.55, 0)
        })
        TextShape.create(this.time2, {
            text: ""
        })

        this.avatar3 = engine.addEntity()
        Transform.create(this.avatar3, {
            parent: this.player3Container,
            position: Vector3.create(-0.3, 0, 0)
        })

        this.name3 = engine.addEntity()
        Transform.create(this.name3, {
            parent: this.player3Container,
            position: Vector3.create(0, 0.55, 0)
        })
        TextShape.create(this.name3, {
            text: ""
        })

        this.time3 = engine.addEntity()
        Transform.create(this.time3, {
            parent: this.player3Container,
            position: Vector3.create(0, -0.55, 0)
        })
        TextShape.create(this.time3, {
            text: ""
        })

        engine.addSystem(this.update.bind(this))
    }

    triggerWinningMoment(): void {
        Material.setPbrMaterial(this.entity, this.getWinningMomentMaterial())
    }

    update(_dt: number) {
        this.elapsed += _dt

        if (this.elapsed >= BigScreen.REFRESH_TIME) {
            this.elapsed = 0

            if (this.leaderboard.playerScores.size > 2) {
                let index: number = 0
                for (let player of this.leaderboard.playerScores.keys()) {
                    let totalScore: number = 0
                    for (let score of this.leaderboard.playerScores.get(player).keys()) {
                        totalScore += this.leaderboard.playerScores.get(player).get(score)
                    }

                    this.updateText(index, player, totalScore)
                    index++
                }
            }
        }
    }

    private getOffMaterial(): PBMaterial_PbrMaterial {
        return {
            albedoColor: Color4.Black()
        }
    }

    private getWinningMomentMaterial(): PBMaterial_PbrMaterial {
        return {
            texture: Material.Texture.Common({
                src: "images/ui/screens/screenBig_winnersBkg.png",
            }),
            emissiveTexture: Material.Texture.Common({
                src: "images/ui/screens/screenBig_winnersBkg.png",
            }),
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        }
    }

    private getAvatarMaterial(): PBMaterial_PbrMaterial {
        return {
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
        }
    }

    private updateText(_index: number, _name: string, _time: number): void {
        switch (_index) {
            case 0: {
                let nameText = TextShape.getMutableOrNull(this.name1)
                if (nameText) {
                    nameText.text = _name.substring(0, 12).toUpperCase()
                }

                let timeText = TextShape.getMutableOrNull(this.time1)
                if (timeText) {
                    timeText.text = this.formatTime(_time) + this.formatTimeMilli(_time)
                }
            }
                break
            case 1: {
                let nameText = TextShape.getMutableOrNull(this.name2)
                if (nameText) {
                    nameText.text = _name.substring(0, 12).toUpperCase()
                }

                let timeText = TextShape.getMutableOrNull(this.time2)
                if (timeText) {
                    timeText.text = this.formatTime(_time) + this.formatTimeMilli(_time)
                }
            }
                break
            case 2: {
                let nameText = TextShape.getMutableOrNull(this.name3)
                if (nameText) {
                    nameText.text = _name.substring(0, 12).toUpperCase()
                }

                let timeText = TextShape.getMutableOrNull(this.time3)
                if (timeText) {
                    timeText.text = this.formatTime(_time) + this.formatTimeMilli(_time)
                }
            }
                break
        }
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
}