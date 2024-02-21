import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { Car } from "@vegascity/racetrack/src/car";

export class Particle {
    entity:Entity
    dead:boolean = true
    size:number = 0
    originalY: number

    constructor(_position:Vector3,_parent:Entity){
        this.entity = engine.addEntity()

        GltfContainer.create(this.entity, {src:"models/fx/smokeball.glb"})
        Transform.create(this.entity, {scale:Vector3.Zero()})

        this.spawn(_position,_parent)
    }

    spawn(_position:Vector3,_parent:Entity){
        
        if(Car.instances[0].data.speed<=7){
            return
        }
        this.dead = false
        if(!Car.instances[0].data.isDrifting){
            this.size = Math.abs(Car.instances[0].data.speed)/325
        } else {
            this.size = Math.abs(Car.instances[0].data.speed)/120
        }
        Transform.getMutable(this.entity).position = _position
     //   Transform.getMutable(this.entity).parent = _parent
        Transform.getMutable(this.entity).scale = Vector3.create(this.size,this.size,this.size)
        
        let base:Entity = Car.instances[0].data.carEntity
        this.originalY = Quaternion.toEulerAngles(Transform.get(base).rotation).y

        Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(Math.random()*360,Math.random()*360,Math.random()*360)
    }

    die(){
        this.dead = true
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }

    update(_dt:number){
        if(this.dead){
            return
        }
        this.size -= _dt/2
        Transform.getMutable(this.entity).scale = Vector3.create(this.size,this.size,this.size)
        Transform.getMutable(this.entity).position = Vector3.create(Transform.getMutable(this.entity).position.x,Transform.getMutable(this.entity).position.y+_dt*2,Transform.getMutable(this.entity).position.z)

      //  let base:Entity = Car.instances[0].data.carEntity
      //  Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(0,this.originalY+Quaternion.toEulerAngles(Transform.get(base).rotation).y,0)// Quaternion.multiply(this.originalRotation, Transform.get(Car.instances[0].data.carEntity).rotation)

        if(this.size<=0){
            this.die()
        }
    }
} 