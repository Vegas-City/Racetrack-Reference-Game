import { Entity } from '@dcl/ecs'
import { Quaternion, Vector3 } from '@dcl/ecs-math'

import * as npc from 'dcl-npc-toolkit'
import { Info } from './info'


export class GuideNPC {

    guideDialog: npc.Dialog[]
    guideNPC: Entity
            
    constructor(){

        new Info(Vector3.create(9.5,1, 3.7))

        // NPC
        this.guideNPC = npc.create(
            {
                position: Vector3.create(9.5, 1, 3.74),
                rotation: Quaternion.fromEulerDegrees(0,180,0),
                scale: Vector3.create(1, 1, 1),
            },
            //NPC Data Object
            {
                type: npc.NPCType.CUSTOM,
                model: 'models/npcs/GuideNPC.glb',
                onActivate: () => {
                    npc.talk(this.guideNPC, this.guideDialog)
                },
                onWalkAway: () => { 
                    console.log('test on walk away function')
                },
                faceUser: true,
                reactDistance: 2,
                idleAnim: 'idle1',
                walkingAnim: 'walk1',
                hoverText: 'Talk',
                continueOnWalkAway: true,
                onlyClickTrigger: false,
                onlyExternalTrigger: false,
                darkUI: true,
            }
        )

        this.guideDialog = [
            {
                text: "Hi, I'll guide you on how to race",
                isEndOfDialog: true
            }
        ]
    }
}