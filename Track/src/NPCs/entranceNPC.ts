import { Entity } from '@dcl/ecs'
import { Quaternion, Vector3 } from '@dcl/ecs-math'

import * as npc from 'dcl-npc-toolkit'


export class EntranceNPC {

    entranceDialog: npc.Dialog[]
    entranceNPC: Entity
            
    constructor(){

        // NPC
        this.entranceNPC = npc.create(
            {
                position: Vector3.create(50.6, 1, -10.5),
                rotation: Quaternion.fromEulerDegrees(0,180,0),
                scale: Vector3.create(1, 1, 1),
            },
            //NPC Data Object
            {
                type: npc.NPCType.CUSTOM,
                model: 'models/npcs/EntranceNPC.glb',
                onActivate: () => {
                    npc.talk(this.entranceNPC, this.entranceDialog)
                    npc.playAnimation(this.entranceNPC,"Talk")
                },
                onWalkAway: () => { 
                    console.log('test on walk away function')
                    npc.playAnimation(this.entranceNPC,"Idle")
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

        this.entranceDialog = [
            {
                text: "Welcome to the racetrack",
                isEndOfDialog: true
            },
        ]
    }
}