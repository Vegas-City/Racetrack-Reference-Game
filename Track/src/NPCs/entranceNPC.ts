import { Entity } from '@dcl/ecs'
import { Quaternion, Vector3 } from '@dcl/ecs-math'

import * as npc from 'dcl-npc-toolkit'
import { Info } from './info'


export class EntranceNPC {

    entranceDialog: npc.Dialog[]
    entranceNPC: Entity
            
    constructor(){
        
        new Info(Vector3.create(50.6, 1, -10.5))

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
                idleAnim: 'idle1',
                walkingAnim: 'walk1',
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