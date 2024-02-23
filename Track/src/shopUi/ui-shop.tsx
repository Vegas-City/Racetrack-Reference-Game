import { Color4 } from '@dcl/sdk/math';
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import Wearable from '../utils/interfaces/wearable';
import { popup } from '../utils/ui-provider';
import { InputAction, PointerEventType, engine, inputSystem } from '@dcl/sdk/ecs';
import { Scene } from '../scene';
import { ServerComms } from '../Server/serverComms';


export default class ShopUI {

    private visible: boolean = false;
    private data: Wearable = {
        name: "",
        rarity: "",
        id: "",
        price: 0,
        image_path: "",
        numericalId: -1,
        active: true,
        collection: "store",
        stock: 0,
        posy: 0
    }

    constructor() {
        let self = this
        engine.addSystem(() => {
            if (!self.visible) return
            const cmd1 = inputSystem.getInputCommand(
                InputAction.IA_PRIMARY,
                PointerEventType.PET_DOWN,
            )
            if (cmd1) {
                self.hide()
                return
            }
            const cmd2 = inputSystem.getInputCommand(
                InputAction.IA_SECONDARY,
                PointerEventType.PET_DOWN,
            )
            if (cmd2) {
                self.buyClick()
                return
            }
 
        })
    }

    public show(wearable_data: Wearable) {
        if(this.visible) return;
      
        this.data = wearable_data;
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    private buyClick(){
        this.hide()
        ServerComms.canClaimWearable(this.data.numericalId).then(async response => await JSON.parse(response.body)).then(data => {
            console.log(data)
            if(data.response.hasClaimed){
                popup.show("You already have claimed this wearable")
            }
            else if(!data.response.canSpend){
                popup.show("You cannot afford this wearable")
            } 
            else if(!data.response.hasClaimed && data.response.canSpend){
                Scene.shopController.sendBuyRequest(this.data.id, this.data.price, this.data.collection)
            }
        })
    }

    public render(){
        return <UiEntity
            key='shop'
            uiTransform={{
                positionType: 'absolute',
                height: 0,
                width: "100%",
                justifyContent: 'center',
                alignItems: 'center',
                display: Scene.loaded ? 'flex' : 'none'
            }}
        >
            <UiEntity
                uiTransform={{
                    width: 926 / 1.2,
                    height: 784 / 1.2,
                    positionType: "absolute",
                    position: { top: 200 },
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: this.visible ? 'flex' : 'none'
                }}
                uiBackground={{ textureMode: "stretch", texture: { src: 'images/ui/wearablesUI/2d_forAnyText.png' } }}
            >   
                <UiEntity
                    uiTransform={{
                        positionType: "absolute",
                        position: { top: 300 },
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    uiText={{
                        value: "Would you like to exchange\n" + this.data.price + " Points for\n" + this.data.name + "?",
                        textAlign: "middle-center",
                        fontSize: 30,
                        color: Color4.White()
                    }}
                />

                {/* Buttons */}
                <UiEntity
                    uiTransform={{
                        positionType: "absolute",
                        position: { top: 310 , right: '15%'},
                        width: "70%",
                        flexDirection: "row",
                        justifyContent: 'space-between',
                    }}
                >   
                    <UiEntity
                        uiTransform={{
                            width: 348 / 1.4,
                            height: 292 / 1.4,
                            justifyContent: 'space-between'
                        }}
                        uiBackground={{ textureMode: "stretch", texture: { src: 'images/ui/wearablesUI/2d_cancel.png' } }}
                        onMouseDown={this.hide.bind(this)}
                    >
                    </UiEntity>

                    <UiEntity
                        uiTransform={{
                            width: 348 / 1.4,
                            height: 292 / 1.4,
                            justifyContent: 'space-between'
                        }}
                        uiBackground={{ textureMode: "stretch", texture: { src: 'images/ui/wearablesUI/2d_confirm.png' } }}
                        onMouseDown={this.buyClick.bind(this)}                 
                    >
                    </UiEntity>
                </UiEntity>


            </UiEntity>
        </UiEntity>
    }
}