import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import * as utils from '@dcl-sdk/utils'
import { PlayerData } from "../Server/types/playerData"
import { ServerComms } from "../Server/serverComms"

export enum EventUIEnum {
    preEvent,
    lapEvent,
    endEvent,
    newTrackEvent,
    newCarEvent,
    competitionUnlockEvent
}

export class EventUIImage {
    static eventVisibility: boolean = false

    static eventsShownOrWaiting: number = 0
    static notificationTime: number = 4000

    static oldPlayerData: PlayerData = new PlayerData()

    static pointIncrease: number = 0
    static imageSource: string
    static points:string = "+150pts"

    private static component = () => (
        <UiEntity
            key="EventUI"
            uiTransform={{
                positionType: 'absolute',
                position: {
                    top: '25%',
                    right: '50%',
                },
                display: EventUIImage.eventVisibility ? 'flex' : 'none',
            }}
        >
        <UiEntity
            key="EventUIImage"
            uiTransform={{
                position: {
                    left:256
                },
                width:512,
                height:512,
                display: EventUIImage.eventVisibility ? 'flex' : 'none',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: "images/ui/events/"+EventUIImage.imageSource,
                    wrapMode: 'repeat'
                }
            }}
        >
        </UiEntity>
        <Label
                key="NewCarEventLabel"
                value={EventUIImage.points}
                fontSize={60}
                font="monospace"
                textAlign="middle-center"
                color={Color4.create(24/255, 110/255, 205/255, 1)}
                uiTransform={{
                    positionType: 'absolute',
                    width: 512,
                    height: 0,
                    position: {
                        top: 325,
                        left: 256,
                    },
                }}
            >
            </Label>
        </UiEntity>
    )

    static Render() {
        return [
            EventUIImage.component()
        ]
    }

    static triggerEvent(_event: EventUIEnum): void {
        EventUIImage.points = ""
        utils.timers.setTimeout(() => {
            EventUIImage.eventVisibility = true
            switch(_event){
                case EventUIEnum.preEvent:
                    EventUIImage.imageSource = this.getPreEventImage()
                    break
                case EventUIEnum.competitionUnlockEvent:
                    EventUIImage.imageSource = this.getCompetionUnlockEventImage()
                    break
                case EventUIEnum.endEvent:
                    EventUIImage.imageSource = this.getEndEventImage()
                    break
                case EventUIEnum.lapEvent:
                    EventUIImage.imageSource = this.getLapEventImage()
                    break
                case EventUIEnum.newCarEvent:
                    EventUIImage.imageSource = this.getNewCarEventImage()
                    break
                case EventUIEnum.newTrackEvent:
                    EventUIImage.imageSource = this.getNewTrackEventImage()
                    break
            }
        }, EventUIImage.notificationTime * EventUIImage.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUIImage.eventVisibility = false
            EventUIImage.eventsShownOrWaiting -= 1
        }, EventUIImage.notificationTime * EventUIImage.eventsShownOrWaiting + EventUIImage.notificationTime)

        EventUIImage.eventsShownOrWaiting += 1
    }

    private static getPreEventImage(): string {
        return "msg_holdEtoExit.png"
    }

    private static getLapEventImage(): string {
        return "2D_lapCompleted.png"
    }

    private static getEndEventImage(): string {
        if (EventUIImage.pointIncrease > 0) {
            EventUIImage.points = "+" + EventUIImage.pointIncrease + " PTS"
            return "msg_wellDone.png"
        } else {
            // But did the pb get quicker?
            if(EventUIImage.pointIncrease == -1){ // No new points but we got a better PB
                return "2D_wellDone.png"
            } else {
                return "msg_tryAgain.png"
            }
        }

    }

    private static getNewTrackEventImage(): string {
        // Work out which track
        switch (ServerComms.player.tracks.length) {
            case 2:
            case 6:
            case 10:
                return "msg_unlockedTrack2.png"
            case 3:
            case 7:
            case 11:
                return "msg_unlockedTrack3.png"
            case 4:
            case 8:
            case 12:
                return "msg_unlockedTrack4.png"
        }
    }

    private static getNewCarEventImage(): string {
        // Work out which car
        switch (ServerComms.player.cars.length) {
            case 2:
                return "msg_unlockedCar2.png"
            case 3:
                return "msg_unlockedCar3.png"
        }
    }

    private static getCompetionUnlockEventImage(): string {
        return "msg_unlockedCompetition.png"
    }

    static comparePlayerData() {
        EventUIImage.pointIncrease = ServerComms.player.points - EventUIImage.oldPlayerData.points

        if(EventUIImage.pointIncrease == 0){
            // Did the pb get quicker?
            let oldPB:number = 0
            let newPB:number = 0

            EventUIImage.oldPlayerData.tracks.forEach(track => {
                if(track.guid == ServerComms.currentTrack){
                    oldPB = track.pb
                }
            });

            ServerComms.player.tracks.forEach(track => {
                if(track.guid == ServerComms.currentTrack){
                    newPB = track.pb
                }
            });

            if(newPB<oldPB){
                EventUIImage.pointIncrease = -1 // We'll use this later
            }
        }

        EventUIImage.triggerEvent(EventUIEnum.endEvent)

        // Check for track unlock
        if (ServerComms.player.tracks.length > EventUIImage.oldPlayerData.tracks.length) {
            EventUIImage.triggerEvent(EventUIEnum.newTrackEvent)
        }

        if (ServerComms.player.cars.length > EventUIImage.oldPlayerData.cars.length) {
            EventUIImage.triggerEvent(EventUIEnum.newCarEvent)
        }
    }
}