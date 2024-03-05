import { Quaternion, Vector3 } from "@dcl/ecs-math"
import { Animator, Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"

export class Explosion {
        entity: Entity
        dead: boolean = false
        life: number = 0
    
        constructor() {
            this.entity = engine.addEntity()
            Transform.create(this.entity)
            Animator.create(this.entity, {
                states: [
                    {
                        clip: 'Animation',
                        playing: false,
                        loop: false,
                        speed: 1
                    }
                ]
            })
        }
    
        spawn(_position: Vector3) {
            GltfContainer.create(this.entity,{src:"models/fx/fireworkSmall.glb"})
            Transform.getMutable(this.entity).scale = Vector3.create(2,2,2)
            Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(Math.random()*360,Math.random()*360,Math.random()*360)
            Transform.getMutable(this.entity).position = _position
            this.life = 4
            Animator.playSingleAnimation(this.entity,"Animation",true)
            this.dead = false
        }
    
        die() {
            GltfContainer.deleteFrom(this.entity)
            this.dead = true
            Animator.stopAllAnimations(this.entity)
            Transform.getMutable(this.entity).scale = Vector3.Zero()
        }
    
        update(_dt: number) {
            if (this.dead) {
                return
            }
    
            this.life -= _dt
    
            if (this.life <= 0) {
                this.die()
            }
        }
    }