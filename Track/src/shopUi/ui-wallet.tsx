import { Color4 } from '@dcl/sdk/math';
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'



export default class Wallet {

    private visible: boolean = true;
    static _currentValue: number = 0;
    public get currentValue() {
        return Wallet._currentValue
    }

    constructor() {
        let self = this  
        //this.hide();
    }

    public addValue(value: number) {
        Wallet._currentValue += value;
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    public render(){
        return <UiEntity
        key='wallet'
            uiTransform={{
                positionType: "absolute",
                width: "100%",
                height: 0,
                display: this.visible ? 'flex' : 'none'
            }}
        >
            <UiEntity
                uiTransform={{
                    width: 350 / 1.4,
                    height: 168 / 1.4,
                    positionType: 'absolute',
                    position: { right:"3%" },
                    display: this.visible ? 'flex' : 'none'
                }}
                uiBackground={{ textureMode: "stretch", texture: { src: 'textures/ui/score.png' } }}
            >

                <UiEntity
                    uiTransform={{
                        width: "100%",
                        height: 30,
                        justifyContent:'center',
                        position: { right: 30, top: 27 },
                        display: this.visible ? 'flex' : 'none'
                    }}
                    uiText={{
                        value: "" + Wallet._currentValue,
                        textAlign: "middle-right",
                        fontSize: 50,
                        color: Color4.White()
                    }}
                />

                <UiEntity
                    uiTransform={{
                        position: { right: 52, top: 27 },
                        display: this.visible ? 'flex' : 'none'
                    }}
                    uiText={{
                        value: "SOPH Points",
                        textAlign: "middle-right",
                        fontSize: 18,
                        color: Color4.White()
                    }}
                />
                    
            </UiEntity>
        </UiEntity>
    }
}