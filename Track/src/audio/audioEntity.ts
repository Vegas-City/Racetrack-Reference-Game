import { AudioSource, Entity, MeshRenderer, Transform, engine } from "@dcl/ecs"
import { Vector3 } from "@dcl/ecs-math"
import { AvatarAnchorPointType, AvatarAttach } from "@dcl/sdk/ecs"

export class AudioEntity {
    entities: Entity[] = []
    currentEntity: number = 0
    followPlayer: boolean

    constructor(_audioPath: string, _volume: number, _numberOfEntities: number, _followPlayer: boolean = false) {

        this.followPlayer = _followPlayer

        for (let index = 0; index < _numberOfEntities; index++) {
            let entity = engine.addEntity()

            if (_followPlayer) {
                let parent: Entity = engine.addEntity()
                Transform.createOrReplace(parent, { position: Vector3.create(0, 0, 0), scale: Vector3.create(0.001, 0.001, 0.001) })
                Transform.createOrReplace(entity, { parent: parent, position: Vector3.create(0, 2, 0), scale: Vector3.create(0.001, 0.001, 0.001) })
                AvatarAttach.createOrReplace(parent, {
                    anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG,
                })
            } else {
                Transform.createOrReplace(entity, { position: Vector3.create(2, 2, 2), scale: Vector3.create(0.001, 0.001, 0.001) })
            }
            AudioSource.createOrReplace(entity, {
                audioClipUrl: _audioPath,
                playing: false,
                volume: _volume,
                loop: _followPlayer
            })
            MeshRenderer.setBox(entity)
            this.entities.push(entity)
        }
    }

    playSound(_position: Vector3) {
        let transform = Transform.getMutableOrNull(this.entities[this.currentEntity])
        let audioSource = AudioSource.getMutableOrNull(this.entities[this.currentEntity])

        if (transform) {
            transform.position = _position
        }
        if (audioSource) {
            audioSource.playing = true
        }

        this.incrementEntity()
    }

    incrementEntity() {
        this.currentEntity = this.currentEntity + 1
        if (this.currentEntity > this.entities.length - 1) {
            this.currentEntity = 0
        }
    }

    stopAll() {
        this.entities.forEach(entity => {
            let audioSource = AudioSource.getMutableOrNull(entity)
            if (audioSource) {
                audioSource.playing = false
            }
        });
    }
}