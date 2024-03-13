import { Entity, Material, MaterialTransparencyMode, MeshRenderer, PBMaterial_PbrMaterial, TextAlignMode, TextShape, Transform, engine } from "@dcl/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math";
import { LeaderboardUI } from "../UI/leaderboardUI";
import { UserData } from "../Server/Helper";
import { VideoScreens } from "./showManager/videoScreens";
import { setupShow } from "./showManager/showSetup";
import { ServerComms } from "../Server/serverComms";

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
        Transform.createOrReplace(this.entity, {
            position: _pos,
            rotation: Quaternion.multiply(_rot, Quaternion.fromEulerDegrees(0, 180, 0)),
            scale: _scale
        })

        MeshRenderer.setPlane(this.entity)
        Material.setPbrMaterial(this.entity, this.getOffMaterial())

        this.initialiseWinningMomentEntities()

        VideoScreens.Initialise(this.entity)
        setupShow()

        engine.addSystem(this.update.bind(this))
    }

    triggerWinningMoment(): void {
        Material.setPbrMaterial(this.entity, this.getWinningMomentMaterial())

        let player1Transform = Transform.getMutableOrNull(this.player1Container)
        if (player1Transform) {
            player1Transform.scale = Vector3.create(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z)
        }

        let player2Transform = Transform.getMutableOrNull(this.player2Container)
        if (player2Transform) {
            player2Transform.scale = Vector3.create(0.8 / this.scale.x, 0.8 / this.scale.y, 0.8 / this.scale.z)
        }

        let player3Transform = Transform.getMutableOrNull(this.player3Container)
        if (player3Transform) {
            player3Transform.scale = Vector3.create(0.8 / this.scale.x, 0.8 / this.scale.y, 0.8 / this.scale.z)
        }
    }

    update(_dt: number) {
        this.elapsed += _dt

        if (this.elapsed >= BigScreen.REFRESH_TIME) {
            this.elapsed = 0

            if (this.leaderboard.playerScores.size > 2) {
                let index: number = 0
                for (let player of this.leaderboard.playerScores.keys()) {
                    this.updateText(index, this.leaderboard.playerScores.get(player).name, this.leaderboard.playerScores.get(player).totalScore)
                    this.updateAvatar(index, player)
                    index++
                }
            }
        }
    }

    private initialiseWinningMomentEntities(): void {
        this.player1Container = engine.addEntity()
        Transform.createOrReplace(this.player1Container, {
            parent: this.entity,
            position: Vector3.create(-0.11, 0.2, -0.05),
            scale: Vector3.Zero()
        })

        this.player2Container = engine.addEntity()
        Transform.createOrReplace(this.player2Container, {
            parent: this.entity,
            position: Vector3.create(-0.3, -0.1, -0.05),
            scale: Vector3.Zero()
        })

        this.player3Container = engine.addEntity()
        Transform.createOrReplace(this.player3Container, {
            parent: this.entity,
            position: Vector3.create(0.15, -0.1, -0.05),
            scale: Vector3.Zero()
        })

        this.avatar1 = engine.addEntity()
        Transform.createOrReplace(this.avatar1, {
            parent: this.player1Container,
            position: Vector3.create(-1.5, 0.15, 0),
            scale: Vector3.create(2, 2, 2)
        })

        this.name1 = engine.addEntity()
        Transform.createOrReplace(this.name1, {
            parent: this.player1Container,
            position: Vector3.create(0, 0.55, 0)
        })
        TextShape.createOrReplace(this.name1, {
            text: "",
            fontSize: 10,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        this.time1 = engine.addEntity()
        Transform.createOrReplace(this.time1, {
            parent: this.player1Container,
            position: Vector3.create(0, -0.55, 0)
        })
        TextShape.createOrReplace(this.time1, {
            text: "",
            fontSize: 8,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        this.avatar2 = engine.addEntity()
        Transform.createOrReplace(this.avatar2, {
            parent: this.player2Container,
            position: Vector3.create(-1.5, 0.15, 0),
            scale: Vector3.create(2, 2, 2)
        })

        this.name2 = engine.addEntity()
        Transform.createOrReplace(this.name2, {
            parent: this.player2Container,
            position: Vector3.create(0, 0.55, 0)
        })
        TextShape.createOrReplace(this.name2, {
            text: "",
            fontSize: 10,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        this.time2 = engine.addEntity()
        Transform.createOrReplace(this.time2, {
            parent: this.player2Container,
            position: Vector3.create(0, -0.55, 0)
        })
        TextShape.createOrReplace(this.time2, {
            text: "",
            fontSize: 8,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        this.avatar3 = engine.addEntity()
        Transform.createOrReplace(this.avatar3, {
            parent: this.player3Container,
            position: Vector3.create(-1.5, 0.15, 0),
            scale: Vector3.create(2, 2, 2)
        })

        this.name3 = engine.addEntity()
        Transform.createOrReplace(this.name3, {
            parent: this.player3Container,
            position: Vector3.create(0, 0.55, 0)
        })
        TextShape.createOrReplace(this.name3, {
            text: "",
            fontSize: 10,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })

        this.time3 = engine.addEntity()
        Transform.createOrReplace(this.time3, {
            parent: this.player3Container,
            position: Vector3.create(0, -0.55, 0)
        })
        TextShape.createOrReplace(this.time3, {
            text: "",
            fontSize: 8,
            textAlign: TextAlignMode.TAM_MIDDLE_LEFT
        })
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

    private updateText(_index: number, _name: string, _time: number): void {
        switch (_index) {
            case 0: {
                let nameText = TextShape.getMutableOrNull(this.name1)
                if (nameText) {
                    nameText.text = "1. " + _name.substring(0, 12).toUpperCase()
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
                    nameText.text = "2. " + _name.substring(0, 12).toUpperCase()
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
                    nameText.text = "3. " + _name.substring(0, 12).toUpperCase()
                }

                let timeText = TextShape.getMutableOrNull(this.time3)
                if (timeText) {
                    timeText.text = this.formatTime(_time) + this.formatTimeMilli(_time)
                }
            }
                break
        }
    }

    private async updateAvatar(_index: number, _id: string): Promise<void> {
        switch (_index) {
            case 0: {
                await this.getAvatarMaterial(_id).then(src => {
                    MeshRenderer.setPlane(this.avatar1)
                    Material.setPbrMaterial(this.avatar1, src)
                })
            }
                break
            case 1: {
                await this.getAvatarMaterial(_id).then(src => {
                    MeshRenderer.setPlane(this.avatar2)
                    Material.setPbrMaterial(this.avatar2, src)
                })
            }
                break
            case 2: {
                await this.getAvatarMaterial(_id).then(src => {
                    MeshRenderer.setPlane(this.avatar3)
                    Material.setPbrMaterial(this.avatar3, src)
                })
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