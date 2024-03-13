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
                portrait: "images/portraits/guide_crop.png"
            }
        )

        this.guideDialog = [
            {
                text: "Hello my fellow car enthusiast. I am happy to meet you! You are just a few steps away from starting the game. Let me guide you through the basics!",
                isEndOfDialog: false
            },
            {
                text: "If you are new to the game, you first have to qualify in practice mode. Perfect your driving skills on our first track then move onto competition mode!",
                isEndOfDialog: false
            },
            {
                text: "That is where the fun begins! In competition mode you can unlock cars with better performances as you progress and earn points to get the coolest racing wearables! Come back often to beat your personal best ('PB') and be the best racer who gets on the top of the leaderboard! The top 3 winners will get a special reward at the closing party!",
                isEndOfDialog: false
            },
            {
                text: "Follow the symbols next to the tracks and cars to see what is available for you. Here is a little hint:",
                isEndOfDialog: false
            },
            {
                text: "White cup means a track is unlocked and you can compete on it to get qualified.",
                isEndOfDialog: false
            },
            {
                text: "Yellow cup means you have already qualified on the given track and unlocked the next one.",
                isEndOfDialog: false
            },
            {
                text: "Padlock means the track or car is locked for you. You have to race more to unlock those.",
                isEndOfDialog: false
            },
            {
                text: "Can we start?",
                isQuestion: true,
                isEndOfDialog: false,
                buttons:[
                    { label: "NO", goToDialog:8},
                    { label: "YES", goToDialog:9}
                ]
            },
            {
                text: "Okay, I hope you will come back later to be among the best racers!",
                isEndOfDialog: true
            },
            {
                text: "Great news! Choose from the unlocked racing modes, tracks and cars with the help of this UI next to me and start racing!",
                isEndOfDialog: true
            }
        ]
    }
}