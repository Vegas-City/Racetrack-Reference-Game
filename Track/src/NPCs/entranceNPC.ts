import { Entity } from '@dcl/ecs'
import { Quaternion, Vector3 } from '@dcl/ecs-math'

import * as npc from 'dcl-npc-toolkit'
import { Info } from './info'
import { movePlayerTo } from '~system/RestrictedActions'


export class EntranceNPC {

    entranceDialog: npc.Dialog[]
    entranceNPC: Entity

    constructor() {

        new Info(Vector3.create(50.6, 1, -10.5))

        // NPC
        this.entranceNPC = npc.create(
            {
                position: Vector3.create(50.6, 1, -10.5),
                rotation: Quaternion.fromEulerDegrees(0, 180, 0),
                scale: Vector3.create(1, 1, 1),
            },
            //NPC Data Object
            {
                type: npc.NPCType.CUSTOM,
                model: 'models/npcs/EntranceNPC.glb',
                onActivate: () => {
                    npc.talk(this.entranceNPC, this.entranceDialog)
                    npc.playAnimation(this.entranceNPC, "Talk")
                },
                onWalkAway: () => {
                    console.log('test on walk away function')
                    npc.playAnimation(this.entranceNPC, "Idle")
                },
                faceUser: true,
                idleAnim: 'idle1',
                walkingAnim: 'walk1',
                hoverText: 'Talk',
                continueOnWalkAway: true,
                onlyClickTrigger: true,
                onlyExternalTrigger: false,
                darkUI: true,
                portrait: "images/portraits/entrance_crop.png"
            }
        )

        this.entranceDialog = [
            {
                text: "Welcome to Metaverse Track Days in Decentraland! Get ready to dive into a world of virtual speed and excitement. Whether you're a seasoned racer or a curious observer, there's something for everyone to enjoy.",
                isEndOfDialog: false
            }, {
                text: "Are you ready to experience the thrill of the track in this immersive virtual setting?",
                isQuestion: true,
                isEndOfDialog: false,
                buttons: [
                    { label: "MAYBE NEXT TIME", goToDialog: 2 },
                    { label: "LET'S GO!", goToDialog: 3 }
                ]
            }, {
                text: "Okay, I hope you will come back later to be among the best racers!",
                isEndOfDialog: true
            },
            {
                text: "Great news! I knew you had the guts to go for it!",
                triggeredByNext: () => {
                    movePlayerTo({ newRelativePosition: Vector3.create(8, 2, -2.3), cameraTarget: Vector3.create(8, 4, 7) })
                },
                isEndOfDialog: true
            }
        ]
    }
}