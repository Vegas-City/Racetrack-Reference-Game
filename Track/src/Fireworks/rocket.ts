import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export class Rocket {
    entity:Entity
    dead:boolean = false
    life:number = 0
    speed:number = 5

    constructor(){
        this.entity = engine.addEntity()
        Transform.create(this.entity)
        GltfContainer.create(this.entity, {src:"models/fx/rocket"})
    }

    spawn(_position:Vector3, _rotation:Vector3){
        this.life = 1.5 + Math.random()
    }

    die(){
        this.dead = true
    }

    update(_dt:number){
        if(this.dead){
            return
        }

        this.life -= _dt

        if(this.life<=0){
            this.die()
        }
    }
}