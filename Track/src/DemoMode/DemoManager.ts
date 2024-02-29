import { engine } from "@dcl/sdk/ecs";
import { DemoCar } from "./DemoCar";

export class DemoManager {
    demoCars:DemoCar[] = []
    constructor(){
        engine.addSystem(this.update.bind(this))

        this.demoCars.push(new DemoCar(75,"models/selection/car3.glb"))
        this.demoCars.push(new DemoCar(30,"models/selection/car2.glb"))
        this.demoCars.push(new DemoCar(0,"models/selection/car1.glb"))

        this.show()
    }

    hide(){
        this.demoCars.forEach(demoCar => {
            demoCar.hide()
        });
    }

    show(){
        this.demoCars.forEach(demoCar => {
            demoCar.show()
        });
    }

    update(_dt:number){
        this.demoCars.forEach(demoCar => {
            demoCar.update(_dt)
        });
    }
}