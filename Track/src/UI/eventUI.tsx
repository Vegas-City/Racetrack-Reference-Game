import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import * as utils from '@dcl-sdk/utils'

export class EventUI {
    static preEventVisibility: boolean = false
    static lapEventVisibility: boolean = false
    static endEventVisibility: boolean = false

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

    private static getVisibility(): boolean {
        return EventUI.preEventVisibility || EventUI.lapEventVisibility || EventUI.endEventVisibility
    }

    private static getPreEventText(): string {
        return "Tip: You can exit any time by holding E when not moving"
    }

    private static getLapEventText(): string {
        return ("Lap Completed!").toUpperCase()
    }

    private static getEndEventText(): string {
        return ("Well done!").toUpperCase()
    }
}