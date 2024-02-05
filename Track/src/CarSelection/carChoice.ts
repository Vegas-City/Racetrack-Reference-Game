import { Entity, GltfContainer, InputAction, Transform, TransformType, engine, pointerEventsSystem } from "@dcl/ecs";
import { Vector3 } from "@dcl/ecs-math";
import { CarFactory } from "@vegascity/racetrack/src/car";
import { CarSelectionManager } from "./carSelectionManager";

export class CarChoice {
    entity: Entity
    originalScale: Vector3 = Vector3.Zero()

    constructor(_model: string, _transform: TransformType) {
        this.entity = engine.addEntity()

        GltfContainer.create(this.entity, { src: _model })
        Transform.create(this.entity, _transform)
        this.originalScale = Vector3.clone(_transform.scale)

        let self = this

        pointerEventsSystem.onPointerDown(
            {
                entity: this.entity,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: "Select"
                }
            },
            function () {
                self.LoadCar()
                CarSelectionManager.hide()
            }
        )


    }

    LoadCar() {
        CarFactory.create({
            mass: 150,
            accelerationF: 12,
            accelerationB: 12,
            deceleration: 4,
            minSpeed: -14,
            maxSpeed: 25,
            steerSpeed: 1.5,
            grip: 0.3,
            engineStartAudio: 'audio/engineStart.mp3',
            carGLB: 'models/cars/car1/car.glb',
            carColliderGLB: 'models/cars/car1/carCollider.glb',
            leftWheelGLB: 'models/cars/car1/wheel_left.glb',
            rightWheelGLB: 'models/cars/car1/wheel_right.glb',
            steeringWheelGLB: 'models/cars/car1/steering_wheel.glb',
            brakeLightsGLB: 'models/cars/car1/brakeLights.glb',
            dashboardGLB: 'models/cars/car1/dashboard.glb',
            dashboardPosition: Vector3.create(1.25, 0.2, 0.065),
            wheelX_L: 1,
            wheelX_R: 1,
            wheelZ_F: 1.37,
            wheelZ_B: 1.57,
            wheelY: -0.3,
            carScale: 0.7,
            firstPersonCagePosition: Vector3.create(-0.2, -1.3, 0),
            thirdPersonCagePosition: Vector3.create(0, -0.2, -1.1),
        }, Vector3.create(8.45, 2 + 1, 23.7), 90)
    }

    show() {
        Transform.getMutable(this.entity).scale = Vector3.clone(this.originalScale)
    }

    hide() {
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }
}