import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import * as utils from '@dcl-sdk/utils'

export class EventUI {
    static lapEventVisibility: boolean = false
    static endEventVisibility: boolean = false
    static newTrackEventVisibility: boolean = false
    static newCarEventVisibility: boolean = false
    static competionUnlockEventVisibility: boolean = false

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
        EventUI.lapEventVisibility = true
        utils.timers.setTimeout(() => {
            EventUI.lapEventVisibility = false
        }, 4000)
    }

    static triggerEndEvent(): void {
        EventUI.endEventVisibility = true
        utils.timers.setTimeout(() => {
            EventUI.endEventVisibility = false
        }, 4000)
    }

    static triggerNewTrackEvent(): void {
        EventUI.newTrackEventVisibility = true
        utils.timers.setTimeout(() => {
            EventUI.newTrackEventVisibility = false
        }, 4000)
    }

    static triggerNewCarEvent(): void {
        EventUI.newCarEventVisibility = true
        utils.timers.setTimeout(() => {
            EventUI.newCarEventVisibility = false
        }, 4000)
    }

    static triggerCompetionUnlockEvent(): void {
        EventUI.competionUnlockEventVisibility = true
        utils.timers.setTimeout(() => {
            EventUI.competionUnlockEventVisibility = false
        }, 4000)
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