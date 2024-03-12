import { Entity, GltfContainer, TextShape, Transform, engine } from "@dcl/sdk/ecs";
import { Color3, Quaternion, Vector3 } from "@dcl/sdk/math";
import { LeaderboardUI } from "../UI/leaderboardUI";

export class PodiumNPCs {
    gold: PodiumNPC
    silver: PodiumNPC
    bronze: PodiumNPC
    leaderboard: LeaderboardUI
    updateSpeed: number = 5
    currentUpdateSpeed: number = 0

    constructor(_leaderBoard: LeaderboardUI) {
        this.leaderboard = _leaderBoard

        this.gold = new PodiumNPC("models/npcs/podium_gold.glb", Vector3.create(70.89 + 0.2, 3.23 - 0.88, 93.77), Quaternion.fromEulerDegrees(0, -70, 0))
        this.silver = new PodiumNPC("models/npcs/podium_silver.glb", Vector3.create(71.8, 2.98 - 0.88, 95.8), Quaternion.fromEulerDegrees(0, -50, 0))
        this.bronze = new PodiumNPC("models/npcs/podium_bronze.glb", Vector3.create(70.6, 2.73 - 0.88, 91.6), Quaternion.fromEulerDegrees(0, -90, 0))

        engine.addSystem(this.update.bind(this))
    }

    update(_dt: number) {
        this.currentUpdateSpeed += _dt

        if (this.currentUpdateSpeed >= this.updateSpeed) {
            this.currentUpdateSpeed = 0

            if (this.leaderboard.playerScores.size > 0) {
                let index: number = 0
                for (let player of this.leaderboard.playerScores.keys()) {
                    let name = this.leaderboard.playerScores.get(player).name
                    let totalScore = this.leaderboard.playerScores.get(player).totalScore

                    if (index == 0) {
                        this.gold.updateText(name, totalScore)
                    } else if (index == 1) {
                        this.silver.updateText(name, totalScore)
                    } else if (index == 2) {
                        this.bronze.updateText(name, totalScore)
                    }
                    index++
                }
            }
        }
    }

    remove() {
        engine.removeEntity(this.gold.entity)
        engine.removeEntity(this.silver.entity)
        engine.removeEntity(this.bronze.entity)
    }
}

export class PodiumNPC {
    entity: Entity
    textEntity: Entity

    constructor(_modelPath: string, _position: Vector3, _rotation: Quaternion) {
        this.entity = engine.addEntity()
        this.textEntity = engine.addEntity()

        GltfContainer.create(this.entity, { src: _modelPath })
        Transform.create(this.entity, { position: _position, rotation: _rotation })

        Transform.create(this.textEntity, { parent: this.entity, rotation: Quaternion.fromEulerDegrees(0, 180, 0), position: Vector3.create(0, 0, 1), scale: Vector3.create(0.25, 0.25, 0.25) })
        TextShape.create(this.textEntity, {
            text: "",
            outlineColor: Color3.Black(),
            outlineWidth: 0.15
        })
    }

    updateText(_name: string, _time: number) {
        TextShape.getMutable(this.textEntity).text = _name.substring(0, 12).toLocaleUpperCase() + "\n" + this.formatTime(_time) + this.formatTimeMilli(_time)
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