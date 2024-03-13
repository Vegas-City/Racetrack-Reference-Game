import { Entity } from '@dcl/ecs'
import { Quaternion, Vector3 } from '@dcl/ecs-math'

import * as npc from 'dcl-npc-toolkit'
import { Info } from './info'


export class PitstopNPC {

    pitstopDialog: npc.Dialog[]
    pitstopNPC: Entity

    constructor() {

        new Info(Vector3.create(21, 1, 4.55))

        // NPC
        this.pitstopNPC = npc.create(
            {
                position: Vector3.create(21, 1, 4.51),
                rotation: Quaternion.fromEulerDegrees(0, 180, 0),
                scale: Vector3.create(1, 1, 1),
            },
            //NPC Data Object
            {
                type: npc.NPCType.CUSTOM,
                model: 'models/npcs/PitStopNPC.glb',
                onActivate: () => {
                    npc.talk(this.pitstopNPC, this.pitstopDialog)
                    npc.playAnimation(this.pitstopNPC, "Talk")
                },
                onWalkAway: () => {
                    console.log('test on walk away function')
                    npc.playAnimation(this.pitstopNPC, "Idle")
                },
                faceUser: true,
                reactDistance: 3,
                idleAnim: 'Idle',
                walkingAnim: 'Walk',
                hoverText: 'Talk',
                continueOnWalkAway: true,
                onlyClickTrigger: false,
                onlyExternalTrigger: false,
                darkUI: true,
                portrait: "images/portraits/pitstop_crop.png"
            }
        )

        this.pitstopDialog = [
            {
                text: "Welcome to the pitstop! Here you can learn more about the performance of the 3 cars and check out the different designs. Which one is your favourite?",
                isEndOfDialog: false
            },
            {
                text: "When you have learnt all you have to know start racing, perfect your driving skills and unlock all the 3 cars!",
                isEndOfDialog: false
            },
            {
                text: "I hope you will enjoy your time here!",
                isEndOfDialog: true
            },
        ]
    }
}