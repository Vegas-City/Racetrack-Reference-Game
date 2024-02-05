import { Transform } from "@dcl/ecs";
import { CarChoice } from "./carChoice";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import { Entity, GltfContainer, engine } from "@dcl/sdk/ecs";

export class CarSelectionManager {
    podium:Entity
    podiumSpinSpeed:number = 10
    podiumRotation:number = 0

    carChoices:CarChoice[] = []
    static instance:CarSelectionManager

    constructor(_position:Vector3){
        CarSelectionManager.instance = this

        this.podium = engine.addEntity()
        Transform.create(this.podium, {
            position:_position
        })
        GltfContainer.create(this.podium, {src:"models/selection/podium.glb"})

        this.carChoices.push(new CarChoice(1,"models/selection/car1.glb",{
            parent: this.podium,
            position: Vector3.create(0,0,0),
            rotation: Quaternion.fromEulerDegrees(0,180,0),
            scale: Vector3.create(0.75,0.75,0.75)
        }))

        this.carChoices.push(new CarChoice(2,"models/selection/car2.glb",{
            parent: this.podium,
            position: Vector3.create(0,0,0),
            rotation: Quaternion.fromEulerDegrees(0,180,0),
            scale: Vector3.create(0.75,0.75,0.75)
        }))

        this.carChoices.push(new CarChoice(3,"models/selection/car3.glb",{
            parent: this.podium,
            position: Vector3.create(0,0,0),
            rotation: Quaternion.fromEulerDegrees(0,180,0),  
            scale: Vector3.create(0.75,0.75,0.75)
        }))

        this.carChoices[0].show()

        engine.addSystem(this.update.bind(this))
    }

    update(_dt:number){
        this.podiumRotation += _dt*this.podiumSpinSpeed
        if(this.podiumRotation>360){this.podiumRotation-=360}
        Transform.getMutable(this.podium).rotation = Quaternion.fromEulerDegrees(0,this.podiumRotation,0)
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