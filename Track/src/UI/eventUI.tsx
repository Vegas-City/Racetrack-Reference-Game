import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import * as utils from '@dcl-sdk/utils'
import { PlayerData } from "../Server/types/playerData"
import { ServerComms } from "../Server/serverComms"

export class EventUI {
    static preEventVisibility: boolean = false
    static lapEventVisibility: boolean = false
    static endEventVisibility: boolean = false
    static newTrackEventVisibility: boolean = false
    static newCarEventVisibility: boolean = false
    static competionUnlockEventVisibility: boolean = false

    static eventsShownOrWaiting: number = 0
    static notificationTime: number = 3000

    static oldPlayerData: PlayerData = new PlayerData()

    static pointIncrease: number = 0

    private static component = () => (
        <UiEntity
            key="EventUI"
            uiTransform={{
                positionType: 'absolute',
                position: {
                    top: '30%',
                    right: '50%',
                },
                display: EventUI.getVisibility() ? 'flex' : 'none',

            }}
        >
            <Label
                key="PreEventLabel"
                value={EventUI.getPreEventText()}
                fontSize={40}
                font="monospace"
                textAlign="middle-center"
                color={Color4.create(0.8, 0.8, 0.8, 1)}
                uiTransform={{
                    positionType: 'absolute',
                    width: 1100,
                    height: 100,
                    position: {
                        top: 500,
                        left: -550,
                    },
                    display: EventUI.preEventVisibility ? 'flex' : 'none',

                }}
                uiBackground={{
                    color: Color4.fromInts(1, 1, 1, 230)
                }}
            >
            </Label>
            <Label
                key="LapEventLabel"
                value={EventUI.getLapEventText()}
                fontSize={80}
                font="monospace"
                textAlign="middle-center"
                color={Color4.create(0.8, 0.8, 0.8, 1)}
                uiTransform={{
                    positionType: 'absolute',
                    width: 800,
                    height: 100,
                    position: {
                        top: 0,
                        left: -400,
                    },
                    display: EventUI.lapEventVisibility ? 'flex' : 'none',

                }}
                uiBackground={{
                    color: Color4.fromInts(1, 1, 1, 230)
                }}
            >
            </Label>
            <Label
                key="EndEventLabel"
                value={EventUI.getEndEventText()}
                fontSize={80}
                font="monospace"
                textAlign="middle-center"
                color={Color4.create(0.8, 0.8, 0.8, 1)}
                uiTransform={{
                    positionType: 'absolute',
                    width: 900,
                    height: 200,
                    position: {
                        top: 0,
                        left: -450,
                    },
                    display: EventUI.endEventVisibility ? 'flex' : 'none',

                }}
                uiBackground={{
                    color: Color4.fromInts(1, 1, 1, 230)
                }}
            >
            </Label>
            <Label
                key="NewTrackEventLabel"
                value={EventUI.getNewTrackEventText()}
                fontSize={80}
                font="monospace"
                textAlign="middle-center"
                color={Color4.create(0.8, 0.8, 0.8, 1)}
                uiTransform={{
                    positionType: 'absolute',
                    width: 1500,
                    height: 200,
                    position: {
                        top: 0,
                        left: -750,
                    },
                    display: EventUI.newTrackEventVisibility ? 'flex' : 'none',

                }}
                uiBackground={{
                    color: Color4.fromInts(1, 1, 1, 230)
                }}
            >
            </Label>
            <Label
                key="NewCarEventLabel"
                value={EventUI.getNewCarEventText()}
                fontSize={80}
                font="monospace"
                textAlign="middle-center"
                color={Color4.create(0.8, 0.8, 0.8, 1)}
                uiTransform={{
                    positionType: 'absolute',
                    width: 1500,
                    height: 200,
                    position: {
                        top: 0,
                        left: -750,
                    },
                    display: EventUI.newCarEventVisibility ? 'flex' : 'none',

                }}
                uiBackground={{
                    color: Color4.fromInts(1, 1, 1, 230)
                }}
            >
            </Label>
            <Label
                key="CompetionUnlockEventLabel"
                value={EventUI.getCompetionUnlockEventText()}
                fontSize={80}
                font="monospace"
                textAlign="middle-center"
                color={Color4.create(0.8, 0.8, 0.8, 1)}
                uiTransform={{
                    positionType: 'absolute',
                    width: 1750,
                    height: 200,
                    position: {
                        top: 0,
                        left: -875,
                    },
                    display: EventUI.competionUnlockEventVisibility ? 'flex' : 'none',

                }}
                uiBackground={{
                    color: Color4.fromInts(1, 1, 1, 230)
                }}
            >
            </Label>
        </UiEntity>
    )

    static Render() {
        return [
            EventUI.component()
        ]
    }

    static triggerPreEvent(): void {
        EventUI.preEventVisibility = true
        utils.timers.setTimeout(() => {
            EventUI.preEventVisibility = false
        }, 5000)
    }

    static triggerLapEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.lapEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.lapEventVisibility = false
            EventUI.eventsShownOrWaiting -= 1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting += 1
    }

    static triggerEndEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.endEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.endEventVisibility = false
            EventUI.eventsShownOrWaiting -= 1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting += 1
    }

    static triggerNewTrackEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.newTrackEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.newTrackEventVisibility = false
            EventUI.eventsShownOrWaiting -= 1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting += 1
    }

    static triggerNewCarEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.newCarEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.newCarEventVisibility = false
            EventUI.eventsShownOrWaiting -= 1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting += 1
    }

    static triggerCompetionUnlockEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.competionUnlockEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.competionUnlockEventVisibility = false
            EventUI.eventsShownOrWaiting -= 1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting += 1
    }


    private static getVisibility(): boolean {
        return EventUI.preEventVisibility
            || EventUI.lapEventVisibility
            || EventUI.endEventVisibility
            || EventUI.newTrackEventVisibility
            || EventUI.newCarEventVisibility
            || EventUI.competionUnlockEventVisibility
    }

    private static getPreEventText(): string {
        return "Tip: You can exit any time by holding E when not moving"
    }

    private static getLapEventText(): string {
        return ("Lap Completed!").toUpperCase()
    }

    private static getEndEventText(): string {

        if (EventUI.pointIncrease > 0) {
            return ("Well done!").toUpperCase() + "\n+" + EventUI.pointIncrease + " PTS"
        } else {
            return ("Well done!").toUpperCase()
        }

    }

    private static getNewTrackEventText(): string {
        return ("Congratulations\nYou have unlocked a new track!").toUpperCase()
    }

    private static getNewCarEventText(): string {
        return ("Congratulations\nYou have unlocked a new car!").toUpperCase()
    }

    private static getCompetionUnlockEventText(): string {
        return ("Congratulations\nYou just unlocked competition mode!").toUpperCase()
    }

    static comparePlayerData() {
        EventUI.pointIncrease = ServerComms.player.points - EventUI.oldPlayerData.points
        EventUI.triggerEndEvent()

        // Check for track unlock
        if (ServerComms.player.tracks.length > EventUI.oldPlayerData.tracks.length) {
            this.triggerNewTrackEvent()
        }

        if (ServerComms.player.cars.length > EventUI.oldPlayerData.cars.length) {
            this.triggerNewCarEvent()
        }
    }
}