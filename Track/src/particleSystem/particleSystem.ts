import { Transform, engine } from "@dcl/sdk/ecs";
import { Particle } from "./particle";
import { Vector3 } from "@dcl/sdk/math";
import { Car } from "@vegascity/racetrack/src/car";

export class ParticleSystem {
    particles:Particle[] = []
    spawnSpeed: number = 1/15
    currentSpawn: number = 0

    typePosition1:Vector3
    typePosition2:Vector3

    constructor(){
        try {
            engine.addSystem(this.update.bind(this))
        } catch(ex){
            console.log("Error adding particle system: " + ex)
        }
    }

    update(_dt:number){
        if(Car.instances.length>0){
        
        this.currentSpawn+=_dt
            if(this.currentSpawn>this.spawnSpeed){
                try{
                    // Get tyre positions
                    if(Car.instances[0].data.wheelL2 != null){
                        this.typePosition1 = Transform.getMutableOrNull(Car.instances[0].data.wheelL2)?.position ?? Vector3.Zero()
                        this.spawnParticle(this.typePosition1)
                        this.spawnParticle(this.typePosition1)
                        this.spawnParticle(this.typePosition1)
                    }
                    if(Car.instances[0].data.wheelR2 != null){
                        this.typePosition2 = Transform.getMutableOrNull(Car.instances[0].data.wheelR2)?.position ?? Vector3.Zero()
                        this.spawnParticle(this.typePosition2)
                        this.spawnParticle(this.typePosition2)
                        this.spawnParticle(this.typePosition2)
                    }
                } catch (ex){
                    console.log("Error spawning particles: " + ex)
                }

                this.currentSpawn = 0
            }
        }

        this.particles.forEach(particle => {
            try {
                particle.update(_dt)
            } catch(ex){
                console.log("Error updating particle: " + ex)
            }
        })
    }

    spawnParticle(_position:Vector3){
        // Find a dead particle
        let reusedParticle:boolean = false
        this.particles.forEach(particle => {
            if(particle.dead && !reusedParticle){
                reusedParticle = true
                particle.spawn(Vector3.add(_position,Vector3.create((Math.random()/4)-0.125,-0.6,(Math.random()/4)-0.125)))
            }
        });

        if(!reusedParticle){
            this.particles.push(new Particle(_position))
        }
    }
}