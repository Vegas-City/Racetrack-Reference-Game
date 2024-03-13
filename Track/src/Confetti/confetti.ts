import { Animator, Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class Confetti{
    entitiy:Entity

    constructor(_position:Vector3, _rotation:Quaternion){
        this.entitiy = engine.addEntity()
        Transform.create(this.entitiy, {
            position: _position,
            rotation: _rotation,
            scale: Vector3.Zero()
        })
        GltfContainer.create(this.entitiy, {src:"models/fx/confetti.glb"})

        Animator.create(this.entitiy, {
            states: [
              {
                clip: 'confetti on',
                playing: false,
                loop: true,
              },
              {
                clip: 'confetti off',
                playing: true,
                loop: false,
              },
            ],
        })
    }

    start(){
        Transform.getMutable(this.entitiy).scale= Vector3.One()
        Animator.playSingleAnimation(this.entitiy,"confetti on")
    }

    stop(){
        Transform.getMutable(this.entitiy).scale= Vector3.One()
        Animator.playSingleAnimation(this.entitiy,"confetti off")
    }
}