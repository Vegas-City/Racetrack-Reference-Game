import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import { Rocket } from "./rocket";
import { FireworkParticle } from "./fireworkParticle";
import { Explosion } from "./explosion";
import * as utils from '@dcl-sdk/utils'

export class FireWorkManager {

    static instance:FireWorkManager

    rockets:Rocket[] = []
    fireworkParticles:FireworkParticle[] = []
    explosions:Explosion[] = []

    constructor(){
        FireWorkManager.instance = this

        new FireWorkTrigger(Vector3.create(62,2,96))
        new FireWorkTrigger(Vector3.create(-14,2,7.34))

        engine.addSystem(this.update.bind(this))
    }

    createExplosion(_position){
        let oldExplosion:Explosion = null

        this.explosions.forEach(explosion => {
            if(oldExplosion == null && explosion.dead){
                oldExplosion = explosion
            }
        });

        
        if(oldExplosion!=null){
            oldExplosion.spawn(_position)
        } else {
            let newExplosion = new Explosion()
            newExplosion.spawn(_position)
            this.explosions.push(newExplosion)
        }
    }

    launchFireworks(){
        
        let oldRocket:Rocket = null

        this.rockets.forEach(rocket => {
            if(oldRocket == null && rocket.dead){
                oldRocket = rocket
            }
        });

        let launchPos:Vector3 = Vector3.create(70+Math.random()*2,1,94+Math.random()*2)
        
        if(oldRocket!=null){
            oldRocket.spawn(launchPos,Quaternion.fromEulerDegrees(0,0,0))
        } else {
            let newRocket = new Rocket()
            newRocket.spawn(launchPos,Quaternion.fromEulerDegrees(0,0,0))
            this.rockets.push(newRocket)
        }
    }

    update(_dt:number){
        this.rockets.forEach(rocket => {
            rocket.update(_dt)
        })

        this.explosions.forEach(explosion => {
            explosion.update(_dt)
        })
    }
}

export class FireWorkTrigger {
    entity:Entity

    constructor(_position:Vector3){
        this.entity = engine.addEntity()
        MeshRenderer.setSphere(this.entity)
        MeshCollider.setSphere(this.entity)
        Transform.create(this.entity,{position:_position})

        pointerEventsSystem.onPointerDown(
            {
                entity: this.entity,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: 'Launch salvo'
                }
            },
            function () {
                for(let i:number = 0; i<3; i++){
                    utils.timers.setTimeout(()=>{
                        FireWorkManager.instance.launchFireworks()    
                    },Math.random()*150 + 350*i)
                }
            }
        )
    }
}