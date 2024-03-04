import { engine } from "@dcl/sdk/ecs";
import { DemoCar } from "./DemoCar";

export class DemoManager {
    static demoCars:DemoCar[] = []

    constructor(){
        engine.addSystem(this.update.bind(this))

        DemoManager.demoCars.push(new DemoCar(75,"models/selection/car3.glb"))
        DemoManager.demoCars.push(new DemoCar(30,"models/selection/car2.glb"))
        DemoManager.demoCars.push(new DemoCar(0,"models/selection/car1.glb"))

        DemoManager.show()
    }

    static hide(){
        DemoManager.demoCars.forEach(demoCar => {
            demoCar.hide()
        });
    }

    static show(){
        DemoManager.demoCars.forEach(demoCar => {
            demoCar.show()
        });
    }

    update(_dt:number){
        DemoManager.demoCars.forEach(demoCar => {
            demoCar.update(_dt)
        });
    }
}