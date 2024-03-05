import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { FireWorkManager } from "./fireworkManager";

export class Rocket {
    entity:Entity
    dead:boolean = false
    life:number = 0
    speed:number = 45

    constructor(){
        this.entity = engine.addEntity()
        Transform.create(this.entity)
        GltfContainer.create(this.entity, {src:"models/fx/rocket.glb"})
    }

    spawn(_position:Vector3, _rotation:Vector3){
        Transform.getMutable(this.entity).position = _position
        this.life = 0.5 + Math.random()*0.5
        this.show()
        this.dead = false
    }

    show(){
        Transform.getMutable(this.entity).scale = Vector3.create(0.05,0.05,0.05)
    }

    hide(){
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }

    die(){
        this.dead = true
        FireWorkManager.instance.createExplosion(Transform.get(this.entity).position)
        this.hide()
    }

    update(_dt:number){
        if(this.dead){
            return
        }

        this.life -= _dt

        if(this.life<=0){
            this.die()
        }
        let lastPosition:Vector3 = Transform.getMutable(this.entity).position
        Transform.getMutable(this.entity).position = Vector3.create(lastPosition.x,lastPosition.y+_dt*this.speed,lastPosition.z)
    }
}