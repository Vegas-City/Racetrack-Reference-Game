import { Entity, Transform, engine } from "@dcl/sdk/ecs";
import { Particle } from "./particle";
import { Vector3 } from "@dcl/sdk/math";
import { Car } from "@vegascity/racetrack/src/car";

export class ParticleSystem {
    particles:Particle[] = []
    spawnSpeed: number = 1/60
    currentSpawn: number = 0

    typePosition1:Vector3
    typePosition2:Vector3
    typePosition3:Vector3
    typePosition4:Vector3

    constructor(){
        engine.addSystem(this.update.bind(this))
    }

    update(_dt:number){
        if(Car.instances.length==0){
            return
        }
        
        this.currentSpawn+=_dt
        if(this.currentSpawn>this.spawnSpeed){

            // Get tyre positions
            if(Car.instances[0].data.wheelL2 != null){
                this.typePosition1 = Transform.getMutable(Car.instances[0].data.wheelL2).position
                this.spawnParticle(this.typePosition1,Car.instances[0].data.wheelL2)
            }
            if(Car.instances[0].data.wheelR2 != null){
                this.typePosition2 = Transform.getMutable(Car.instances[0].data.wheelR2).position
                this.spawnParticle(this.typePosition2,Car.instances[0].data.wheelR2)
            }

            this.currentSpawn -= this.spawnSpeed


        }

        this.particles.forEach(particle => {
            particle.update(_dt)
        })
    }

    spawnParticle(_position:Vector3,_wheel:Entity){
        // Find a dead particle
        let reusedParticle:boolean = false
        this.particles.forEach(particle => {
            if(particle.dead && !reusedParticle){
                reusedParticle = true
                particle.spawn(Vector3.add(_position,Vector3.create((Math.random()/4)-0.125,-0.6,(Math.random()/4)-0.125)),_wheel)
            }
        });

        if(!reusedParticle){
            this.particles.push(new Particle(_position,_wheel))
        }
    }
}