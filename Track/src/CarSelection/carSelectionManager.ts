import { Transform } from "@dcl/ecs";
import { CarChoice } from "./carChoice";
import { Quaternion, Vector3 } from "@dcl/ecs-math";

export class CarSelectionManager {
    carChoices:CarChoice[] = []
    static instance:CarSelectionManager

    constructor(){
        CarSelectionManager.instance = this

        this.carChoices.push(new CarChoice("models/selection/car1.glb",{
            position: Vector3.create(3,0,10),
            rotation: Quaternion.fromEulerDegrees(0,180,0),
            scale: Vector3.create(0.75,0.75,0.75)
        }))

        this.carChoices.push(new CarChoice("models/selection/car2.glb",{
            position: Vector3.create(6,0,10),
            rotation: Quaternion.fromEulerDegrees(0,180,0),
            scale: Vector3.create(0.75,0.75,0.75)
        }))

        this.carChoices.push(new CarChoice("models/selection/car3.glb",{
            position: Vector3.create(9,0,10),
            rotation: Quaternion.fromEulerDegrees(0,180,0), 
            scale: Vector3.create(0.75,0.75,0.75)
        }))
    }

    static show(){
        CarSelectionManager.instance.carChoices.forEach(car => {
            car.show()
        });
    }

    static hide(){
        CarSelectionManager.instance.carChoices.forEach(car => {
            car.hide()
        });
    }
}