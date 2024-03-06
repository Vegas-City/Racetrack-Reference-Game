import { Entity, Transform, engine } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import { CarSpecsButton } from "./carSpecsButton";
import { ServerComms } from "../Server/serverComms";
import * as carConfiguration from "../RaceMenu/carConfiguration.json"

export class CarSpecsMenuManager {
    static instance: CarSpecsMenuManager

    baseEntity: Entity
    carSpec1: CarSpecsButton
    carSpec2: CarSpecsButton
    carSpec3: CarSpecsButton

    constructor(_position: Vector3) {
        this.baseEntity = engine.addEntity()
        Transform.create(this.baseEntity, {
            position: _position,
            rotation: Quaternion.fromEulerDegrees(0, 180, 0)
        })

        this.carSpec1 = new CarSpecsButton({
            parent: this.baseEntity,
            position: Vector3.create(8, 2.5, 0),
            rotation: Quaternion.fromEulerDegrees(0, 90, 0),
            scale: Vector3.create(0.1, 1.9, 2.8),
            src: "models/carSpecs/car1.glb"
        })

        this.carSpec2 = new CarSpecsButton({
            parent: this.baseEntity,
            position: Vector3.create(0, 2.5, 0),
            rotation: Quaternion.fromEulerDegrees(0, 90, 0),
            scale: Vector3.create(0.1, 1.9, 2.8),
            src: "models/carSpecs/car2.glb",
            srcLock: "models/carSpecs/lock.glb",
            srcTooltip: "images/ui/tooltips/carTooltip.png",
            startLocked: true
        })

        this.carSpec3 = new CarSpecsButton({
            parent: this.baseEntity,
            position: Vector3.create(-8, 2.5, 0),
            rotation: Quaternion.fromEulerDegrees(0, 90, 0),
            scale: Vector3.create(0.1, 1.9, 2.8),
            src: "models/carSpecs/car3.glb",
            srcLock: "models/carSpecs/lock.glb",
            srcTooltip: "images/ui/tooltips/carTooltip.png",
            startLocked: true
        })

        CarSpecsMenuManager.instance = this
    }

    static update(): void {
        if (!CarSpecsMenuManager.instance || !ServerComms.player) return

        //update cars
        ServerComms.player.cars.forEach(car => {
            for (let carIndex = 0; carIndex < carConfiguration.cars.length; carIndex++) {
                let carGuid = carConfiguration.cars[carIndex].guid
                if (car.guid == carGuid) {
                    if (carIndex == 1) {
                        CarSpecsMenuManager.instance.carSpec2.unlock()
                    }
                    else if (carIndex == 2) {
                        CarSpecsMenuManager.instance.carSpec3.unlock()
                    }
                }
            }
        })
    }
}