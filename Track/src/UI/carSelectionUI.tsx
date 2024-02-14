import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import { UIDimensions } from "./ui"
import * as carConfiguration from "../RaceMenu/carConfiguration.json"
import { RaceMenuManager } from "../RaceMenu/raceMenuManager"


export class CarSelectionUI {

    static SelectionUIShow: boolean = false
    static CarData: JSON
    static CarSelected: boolean = false

    private static component = () => (
        <UiEntity
            key="CarSelectionUI"
            uiBackground={{
                color: Color4.fromInts(165,185,203,255)
            }}
            uiTransform={{
                position: {
                    right: 50*UIDimensions.scaler,
                    top: 200*UIDimensions.scaler
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
                color= {Color4.fromInts(255, 255, 255, 255)}
                fontSize={this.getFontSize(60)}
                font="monospace"
                textAlign="top-left"
                uiTransform={{
                    position: {
                        top: 0,
                        right: -50*UIDimensions.scaler
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
                        texture: { src: "images/ui/selectionUI/previous.png" },
                    }}
                    onMouseDown={() => {
                        RaceMenuManager.loadPreviousCar()
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
                        texture: { src: "images/ui/selectionUI/next.png" },
                    }}
                    onMouseDown={() => {
                        RaceMenuManager.loadNextCar()
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
        if(RaceMenuManager.instance!=null && this.CarSelected!=true){
            return [
                CarSelectionUI.component()
            ]
        } 
    }

    static CarStats(){
        let carStats = carConfiguration.cars[RaceMenuManager.instance.currentCarIndex]

        return carStats.name + "\nTop speed: " + carStats.attributes.maxSpeed*4 + "MPH\nAcceleration: " + carStats.attributes.accelerationF
    }
}