import * as utils from '@dcl-sdk/utils'
import { Confetti } from './confetti'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export class ConfettiManager{

    confettiLaunchers:Confetti[] = []

    constructor(){
        this.confettiLaunchers.push(new Confetti(
            Vector3.create(77.45,8,91.82),
            Quaternion.fromEulerDegrees(0,0,0)
        ))
    }

    start(){
        this.confettiLaunchers.forEach(confetti => {
            confetti.start()
        });

        utils.timers.setTimeout(()=>{
            this.stop()
        },60000) // 1 minute
    }

    stop(){
        this.confettiLaunchers.forEach(confetti => {
            confetti.stop()
        });
    }
}