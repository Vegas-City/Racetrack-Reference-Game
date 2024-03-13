import { Animator, Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class Confetti {
  entitiy: Entity

  constructor(_position: Vector3, _rotation: Quaternion) {
    this.entitiy = engine.addEntity()
    Transform.createOrReplace(this.entitiy, {
      position: _position,
      rotation: _rotation,
      scale: Vector3.Zero()
    })
    GltfContainer.createOrReplace(this.entitiy, { src: "models/fx/confetti.glb" })

    Animator.createOrReplace(this.entitiy, {
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

  start() {
    let transform = Transform.getMutableOrNull(this.entitiy)
    if (transform) {
      transform.scale = Vector3.One()
    }
    Animator.playSingleAnimation(this.entitiy, "confetti on")
  }

  stop() {
    let transform = Transform.getMutableOrNull(this.entitiy)
    if (transform) {
      transform.scale = Vector3.One()
    }
    Animator.playSingleAnimation(this.entitiy, "confetti off")
  }
}