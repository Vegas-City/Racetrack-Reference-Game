import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import * as utils from '@dcl-sdk/utils'

export class EventUI {
    static lapEventVisibility: boolean = false
    static endEventVisibility: boolean = false
    static newTrackEventVisibility: boolean = false
    static newCarEventVisibility: boolean = false
    static competionUnlockEventVisibility: boolean = false

    static eventsShownOrWaiting:number = 0
    static notificationTime:number = 4000

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
                    width: 600,
                    height: 100,
                    position: {
                        top: 0,
                        left: -300,
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
                    width: 600,
                    height: 100,
                    position: {
                        top: 0,
                        left: -300,
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
                    width: 600,
                    height: 100,
                    position: {
                        top: 0,
                        left: -300,
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
                    width: 600,
                    height: 100,
                    position: {
                        top: 0,
                        left: -300,
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

    static triggerLapEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.lapEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.lapEventVisibility = false
            EventUI.eventsShownOrWaiting-=1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting+=1
    }

    static triggerEndEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.endEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.endEventVisibility = false
            EventUI.eventsShownOrWaiting-=1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting+=1
    }

    static triggerNewTrackEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.newTrackEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.newTrackEventVisibility = false
            EventUI.eventsShownOrWaiting-=1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting+=1
    }

    static triggerNewCarEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.newCarEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.newCarEventVisibility = false
            EventUI.eventsShownOrWaiting-=1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting+=1
    }

    static triggerCompetionUnlockEvent(): void {
        utils.timers.setTimeout(() => {
            EventUI.competionUnlockEventVisibility = true
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUI.competionUnlockEventVisibility = false
            EventUI.eventsShownOrWaiting-=1
        }, EventUI.notificationTime * EventUI.eventsShownOrWaiting + EventUI.notificationTime)

        EventUI.eventsShownOrWaiting+=1
    }
    
  
    private static getVisibility(): boolean {
        return EventUI.lapEventVisibility || EventUI.endEventVisibility
    }

    private static getLapEventText(): string {
        return ("Lap Completed!").toUpperCase()
    }

    private static getEndEventText(): string {
        return ("Well done!").toUpperCase()
    }

    private static getNewTrackEventText(): string {
        return("Congratulations, you have unlocked a new track!").toUpperCase()
    }

    private static getNewCarEventText(): string {
        return("Congratulations, you have unlocked a new car!").toUpperCase()
    }

    private static getCompetionUnlockEventText(): string {
        return("Congratulations, you just unlocked competition mode!").toUpperCase()
    }
}