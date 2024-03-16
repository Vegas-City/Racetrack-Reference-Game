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
    active: boolean = false

    constructor(_leaderBoard: LeaderboardUI) {
        this.leaderboard = _leaderBoard

        this.gold = new PodiumNPC("models/npcs/podium_gold.glb", Vector3.create(70.89 + 0.2, 3.23 - 0.43, 93.77), Quaternion.fromEulerDegrees(0, -70, 0), Vector3.create(69.95 + 0.1, 1.74, 94.11 - 0.02))
        this.silver = new PodiumNPC("models/npcs/podium_silver.glb", Vector3.create(71.8, 2.98 - 0.43, 95.8), Quaternion.fromEulerDegrees(0, -50, 0), Vector3.create(70.61 + 0.13, 1.74, 96.16 - 0.023))
        this.bronze = new PodiumNPC("models/npcs/podium_bronze.glb", Vector3.create(70.6, 2.73 - 0.43, 91.6), Quaternion.fromEulerDegrees(0, -90, 0), Vector3.create(69.27 + 0.13, 1.74, 91.97 - 0.023))

        engine.addSystem(this.update.bind(this))
    }

    update(_dt: number) {
        if (!this.active) return

        this.currentUpdateSpeed += _dt

        if (this.currentUpdateSpeed >= this.updateSpeed) {
            this.currentUpdateSpeed = 0

            if (this.leaderboard.playerScores.size > 0) {
                let index: number = 0
                for (let player of this.leaderboard.playerScores.keys()) {
                    let name = this.leaderboard.playerScores.get(player)?.name ?? ""
                    let totalScore = this.leaderboard.playerScores.get(player)?.totalScore ?? 0

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

    start() {
        this.gold.show()
        this.silver.show()
        this.bronze.show()

        this.active = true
    }

    end() {
        this.gold.hide()
        this.silver.hide()
        this.bronze.hide()

        this.active = false
    }
}

export class PodiumNPC {
    entity: Entity
    textEntity: Entity

    constructor(_modelPath: string, _position: Vector3, _rotation: Quaternion, _textPosition: Vector3) {
        this.entity = engine.addEntity()
        this.textEntity = engine.addEntity()

        GltfContainer.createOrReplace(this.entity, { src: _modelPath })
        Transform.createOrReplace(this.entity, { position: _position, rotation: _rotation, scale: Vector3.Zero() })

        Transform.createOrReplace(this.textEntity, { rotation: Quaternion.fromEulerDegrees(0, 108, 0), position: _textPosition, scale: Vector3.Zero() })
        TextShape.createOrReplace(this.textEntity, {
            text: "",
            outlineColor: Color3.White(),
            outlineWidth: 0.15,
            fontSize: 7
        })
    }

    updateText(_name: string, _time: number): void {
        let textShape = TextShape.getMutableOrNull(this.textEntity)
        if (textShape) {
            textShape.text = _name.substring(0, 12).toLocaleUpperCase()// + "\n" + this.formatTime(_time) + this.formatTimeMilli(_time) // no score for now
        }
    }

    show(): void {
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.One()
        }

        let textTransform = Transform.getMutableOrNull(this.textEntity)
        if (textTransform) {
            textTransform.scale = Vector3.create(0.25, 0.25, 0.25)
        }
    }

    hide(): void {
        let transform = Transform.getMutableOrNull(this.entity)
        if (transform) {
            transform.scale = Vector3.Zero()
        }

        let textTransform = Transform.getMutableOrNull(this.textEntity)
        if (textTransform) {
            textTransform.scale = Vector3.Zero()
        }
    }
}       