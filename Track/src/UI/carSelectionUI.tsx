import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Car } from "@vegascity/racetrack/src/car"
import { Color4 } from "@dcl/sdk/math"

export class CarSelectionUI {

    static SelectionUIShow: boolean = false

    private static component = () => (
        <UiEntity
            key="CarSelectionUI"
            uiTransform={{
                positionType: 'absolute',
                position: {
                    top: 100,
                    right: 0,
                },
                display: CarSelectionUI.SelectionUIShow ? 'none' : 'none',

            }}
        >
        </UiEntity>
    )

    static ShowUI(_carIndex:number){
        // Load the correct data and show the UI
        CarSelectionUI.SelectionUIShow = true
    }

    static HideUI(){
        CarSelectionUI.SelectionUIShow = false
    }

    static Render() {
        if (Car.instances.length > 0) {
            return [
                CarSelectionUI.component()
            ]
        }
    }
}