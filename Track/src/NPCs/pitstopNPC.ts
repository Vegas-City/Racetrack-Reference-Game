import { Entity } from '@dcl/ecs'
import { Quaternion, Vector3 } from '@dcl/ecs-math'

import * as npc from 'dcl-npc-toolkit'
import { Info } from './info'


export class PitstopNPC {

    pitstopDialog: npc.Dialog[]
    pitstopNPC: Entity
            
    constructor(){

        new Info(Vector3.create(21, 1, 4.55))

        // NPC
        this.pitstopNPC = npc.create(
            {
                position: Vector3.create(21, 1, 4.51),
                rotation: Quaternion.fromEulerDegrees(0,180,0),
                scale: Vector3.create(1, 1, 1),
            },
            //NPC Data Object
            {
                type: npc.NPCType.CUSTOM,
                model: 'models/npcs/PitStopNPC.glb',
                onActivate: () => {
                    npc.talk(this.pitstopNPC, this.pitstopDialog)
                    npc.playAnimation(this.pitstopNPC,"Talk")
                },
                onWalkAway: () => { 
                    console.log('test on walk away function')
                    npc.playAnimation(this.pitstopNPC,"Idle")
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
            }
        )

        this.pitstopDialog = [
            {
                text: "Welcome to the pitstop",
                isEndOfDialog: true
            },
        ]
    }
}