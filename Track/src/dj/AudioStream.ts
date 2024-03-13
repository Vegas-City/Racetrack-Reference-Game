/* entity definition */

import { Entity, Material, MeshRenderer, Transform, VideoPlayer, engine } from "@dcl/ecs"
import { Vector3 } from "@dcl/sdk/math"

export class AudioStream {

    /* fields */

    entity: Entity

    /* constructor */

    constructor(_url: string) {
        this.entity = engine.addEntity()

        // initialise the audio stream (hidden video stream used for stability)
        VideoPlayer.create(this.entity, {
            src: _url,
            playing: false,
        })
        Transform.create(this.entity, {
            position: Vector3.create(8, -8, 8),
            scale: Vector3.Zero()
        })
        MeshRenderer.setPlane(this.entity)
        Material.setPbrMaterial(this.entity, {
            texture: Material.Texture.Video({ videoPlayerEntity: this.entity })
        })
    }

    /* methods */

    getVolume(): number {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer === undefined || videoPlayer === null) {
            return 0
        }

        return videoPlayer.volume
    }

    isLooping(): boolean {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer === undefined || videoPlayer === null) {
            return false
        }

        return videoPlayer.loop
    }

    play(): AudioStream {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer !== undefined && videoPlayer !== null) {
            videoPlayer.playing = true
        }

        return this
    }

    pause(): AudioStream {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer !== undefined && videoPlayer !== null) {
            videoPlayer.playing = false
        }

        return this
    }

    reset(): AudioStream {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer !== undefined && videoPlayer !== null) {
            videoPlayer.position = 0
        }

        return this
    }

    stop(): AudioStream {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer !== undefined && videoPlayer !== null) {
            videoPlayer.playing = false
            videoPlayer.position = 0
        }

        return this
    }

    setLooping(_looping: boolean): AudioStream {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer !== undefined && videoPlayer !== null) {
            videoPlayer.loop = _looping
        }

        return this
    }

    setVolume(_volume: number): AudioStream {
        const videoPlayer = VideoPlayer.getMutableOrNull(this.entity)
        if (videoPlayer !== undefined && videoPlayer !== null) {
            videoPlayer.volume = _volume
        }

        return this
    }
}