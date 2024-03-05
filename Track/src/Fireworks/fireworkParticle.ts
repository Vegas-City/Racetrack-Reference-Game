import { Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export class FireworkParticle {
    entity: Entity
    dead: boolean = false
    speed: number = 5
    decaySpeed: number = 0.2

    constructor() {
        this.entity = engine.addEntity()
        Transform.create(this.entity)
        GltfContainer.create(this.entity, {src:"models/fx/fireworkparticle.glb"})
    }

    spawn(_position: Vector3) {
        this.dead = false
        Transform.getMutable(this.entity).position = Vector3.add(_position, Vector3.create(0.125 - Math.random()/4,Math.random(),0.125 - Math.random()/4))
        let randomSize:number = 0.1 + Math.random()/5
        Transform.getMutable(this.entity).scale = Vector3.create(randomSize,randomSize,randomSize)
    }

    die() {
        this.dead = true
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }

    update(_dt: number) {
        if (this.dead) {
            return
        }

        let scale = Transform.get(this.entity).scale 
        let position = Transform.get(this.entity).position
        let newScale = scale.x-_dt*this.decaySpeed
        if(newScale<0){
            this.die()
        }
        Transform.getMutable(this.entity).scale = Vector3.create(newScale,newScale,newScale)
        Transform.getMutable(this.entity).position = Vector3.create(position.x,position.y-_dt*3,position.z)
    }
}