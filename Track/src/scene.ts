import {engine, Transform, Entity, GltfContainer} from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from '@dcl/sdk/math'


export class Scene {

    static LoadScene():void {

        // Load test track
        let track:Entity = engine.addEntity()
        Transform.create(track,{
            position: Vector3.create(-32,0,16),
            rotation:Quaternion.fromEulerDegrees(0,180,0)
        })
        GltfContainer.create(track, {src:"models/track1.glb"})
    }
} 