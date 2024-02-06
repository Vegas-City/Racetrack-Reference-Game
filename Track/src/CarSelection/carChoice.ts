import { Entity, GltfContainer, InputAction, Transform, TransformType, engine, pointerEventsSystem } from "@dcl/ecs";
import { Vector3 } from "@dcl/ecs-math";
import { CarFactory } from "@vegascity/racetrack/src/car";
import { CarSelectionManager } from "./carSelectionManager";
import * as carConfiguration from "./carConfiguration.json"
import { CarSelectionUI } from "../UI/carSelectionUI";

export class CarChoice {
    entity: Entity
    originalScale: Vector3 = Vector3.Zero()

    constructor(_carIndex:number, _model: string, _transform: TransformType) {
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
                self.LoadCar(_carIndex)
                CarSelectionManager.instance.currentCarIndex = _carIndex
                CarSelectionManager.hide()
                CarSelectionUI.CarSelected = true
            }
        )

        this.hide()
    }

    LoadCar(_carIndex:number) {

        // Load attributes from the JSON
        let carStats = carConfiguration.cars[_carIndex]

        CarFactory.create({
            mass: carStats.attributes.mass,
            accelerationF: carStats.attributes.accelerationF,
            accelerationB: carStats.attributes.accelerationB,
            deceleration: carStats.attributes.deceleration,
            minSpeed: carStats.attributes.minSpeed,
            maxSpeed: carStats.attributes.maxSpeed,
            steerSpeed: carStats.attributes.steerSpeed,
            grip: carStats.attributes.grip,
            engineStartAudio: carStats.audio.engineStart,
            carGLB: carStats.models.car,
            carColliderGLB: carStats.models.carCollider,
            leftWheelGLB: carStats.models.leftWheel,
            rightWheelGLB: carStats.models.rightWheel,
            steeringWheelGLB: carStats.models.steeringWheel,
            brakeLightsGLB: carStats.models.brakeLights,
            dashboardGLB: carStats.models.dashboard,
            dashboardPosition: this.extractVectorFromString(carStats.positions.dashboardPosition),
            wheelX_L: carStats.positions.wheelX_L,
            wheelX_R: carStats.positions.wheelX_R,
            wheelZ_F: carStats.positions.wheelZ_F,
            wheelZ_B: carStats.positions.wheelZ_B,
            wheelY: carStats.positions.wheelY,
            carScale: carStats.positions.carScale,
            firstPersonCagePosition: this.extractVectorFromString(carStats.positions.firstPersonCagePosition),
            thirdPersonCagePosition: this.extractVectorFromString(carStats.positions.thirdPersonCagePosition),
            carIcon: carStats.images.carIcon
        }, Vector3.create(8.45, 2 + 1, 23.7), 90)
    }

    extractVectorFromString(_data:string):Vector3{
        return Vector3.create(Number.parseFloat(_data.split(",")[0]),
                              Number.parseFloat(_data.split(",")[1]),
                              Number.parseFloat(_data.split(",")[2]))
    }

    show() {
        Transform.getMutable(this.entity).scale = Vector3.clone(this.originalScale)
    }

    hide() {
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }
}