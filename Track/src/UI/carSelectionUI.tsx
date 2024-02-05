import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import { UIDimensions } from "./ui"
import * as carConfiguration from "./../CarSelection/carConfiguration.json"
import { CarSelectionManager } from "../CarSelection/carSelectionManager"


export class CarSelectionUI {

    static SelectionUIShow: boolean = false
    static CarData: JSON
    static CarSelected: boolean = false

    private static component = () => (
        <UiEntity
            key="CarSelectionUI"
            uiBackground={{
                color: Color4.create(0,0,0,0.5)
            }}
            uiTransform={{
                position: {
                    right: 500*UIDimensions.scaler,
                    top: 600*UIDimensions.scaler
                },
                width: (1344 / 2)*UIDimensions.scaler,
                height: (750 / 2)*UIDimensions.scaler,
                positionType: 'absolute',
                display: this.SelectionUIShow ? 'flex' : 'none',

            }}
        >
            <Label 
                key="carName"
                value={this.CarStats()}
                color= {Color4.fromInts(74, 220, 246, 255)}
                fontSize={this.getFontSize(60)}
                font="monospace"
                textAlign="top-left"
                uiTransform={{
                    position: {
                        top: 0,
                        right: 0
                    },
                    positionType: "relative",
                }}>
                </Label>
                <UiEntity
                    key="nextCarBtn"
                    uiTransform={{
                        display: "flex",
                        positionType: 'relative',
                        width: 245*UIDimensions.scaler,
                        height: 87*UIDimensions.scaler,
                        position:{
                            top:250*UIDimensions.scaler,
                            left:40*UIDimensions.scaler
                        }
                    }}
                    uiBackground={{
                        textureMode: "stretch",
                        texture: { src: "images/selectionUI/previous.png" },
                    }}
                    onMouseDown={() => {
                        CarSelectionManager.loadPreviousCar()
                    }} />
                <UiEntity
                    key="preveiousCarBtn"
                    uiTransform={{
                        display: "flex",
                        positionType: 'relative',
                        width: 245*UIDimensions.scaler,
                        height: 87*UIDimensions.scaler,
                        position:{
                            top:250*UIDimensions.scaler,
                            left:150*UIDimensions.scaler
                        }
                    }}
                    uiBackground={{
                        textureMode: "stretch",
                        texture: { src: "images/selectionUI/next.png" },
                    }}
                    onMouseDown={() => {
                        CarSelectionManager.loadNextCar()
                    }} />
        </UiEntity>
    )

    static getFontSize(_originalSize:number){
        return _originalSize*UIDimensions.scaler
    }

    static ShowUI(_carIndex:number){
        // Load the correct data and show the UI
        CarSelectionUI.SelectionUIShow = true
    }

    static HideUI(){
        CarSelectionUI.SelectionUIShow = false
    }

    static Render() {
        if(CarSelectionManager.instance!=null && this.CarSelected!=true){
            return [
                CarSelectionUI.component()
            ]
        } 
    }

    static CarStats(){
        let carStats = carConfiguration.cars[CarSelectionManager.instance.currentCarIndex]

        return carStats.name + "\nTop speed:" + carStats.attributes.maxSpeed + "\nAcceleration: " + carStats.attributes.accelerationF
    }
}