import { Color4 } from '@dcl/sdk/math';
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import Wearable from '../utils/interfaces/wearable';
import { popup, wallet } from '../utils/ui-provider';
import { InputAction, PointerEventType, engine, inputSystem } from '@dcl/sdk/ecs';
import { Scene } from '../scene';
import Wallet from './ui-wallet';
import { ServerComms } from '../Server/serverComms';


export default class ShopUI {

    private visible: boolean = false;
    private data: Wearable = {
        name: "Sophia the Robot Headband",
        rarity: "",
        id: "",
        price: 0,
        image_path: "",
        numericalId: -1,
        active: true,
        collection: "store",
        stock: 0
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
                Scene.shopController.sendBuyRequest(this.data.id, this.data.price)
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
                uiBackground={{ textureMode: "stretch", texture: { src: 'textures/ui/middle-window.jpg' } }}
            >   
                <UiEntity
                    uiTransform={{
                        positionType: "absolute",
                        position: { top: 200 },
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: this.visible ? 'flex' : 'none'
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
                        position: { top: 510 , right: '10%'},
                        width: "70%",
                        flexDirection: "row",
                        justifyContent: 'space-between',
                    }}
                >   
                    <UiEntity
                        uiTransform={{
                            width: 348 / 1.4,
                            height: 92 / 1.4,
                            justifyContent: 'space-between',
                            // alignItems: 'center',
                            display: this.visible ? 'flex' : 'none'
                        }}
                        uiBackground={{ textureMode: "stretch", texture: { src: 'textures/ui/button1-variant2.png' } }}
                        onMouseDown={this.hide.bind(this)}
                    >
                        <UiEntity
                            uiTransform={{
                                width: 225,
                            }}
                            uiText={{
                                value: "Cancel",
                                textAlign: "middle-center",
                                fontSize: 40,
                                color: Color4.White()
                            }}
                        />
                        <UiEntity
                            uiTransform={{
                                positionType: "absolute",
                                width: 32,
                                height: 32,
                                position: { top: 17, right: 12 },
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: { src: "textures/ui/hotkeys/Button-F.png" },
                                color: Color4.create(1, 1, 1, 1)
                            }}
                        />
                    </UiEntity>



                    <UiEntity
                        uiTransform={{
                            width: 348 / 1.4,
                            height: 92 / 1.4,
                            justifyContent: 'space-between',
                            // alignItems: 'center',
                            display: this.visible ? 'flex' : 'none'
                        }}
                        uiBackground={{ textureMode: "stretch", texture: { src: 'textures/ui/button1-variant2.png' } }}
                        onMouseDown={this.buyClick.bind(this)}                 
                    >
                        <UiEntity
                            uiTransform={{
                                width: 225,
                            }}
                            uiText={{
                                value: "Confirm",
                                textAlign: "middle-center",
                                fontSize: 40,
                                color: Color4.White()
                            }}
                        />
                        <UiEntity
                            uiTransform={{
                                positionType: "absolute",
                                width: 32,
                                height: 32,
                                position: { top: 17, right: 12 },
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: { src: "textures/ui/hotkeys/Button-E.png" },
                                color: Color4.create(1, 1, 1, 1)
                            }}
                        />
                    </UiEntity>
                </UiEntity>


            </UiEntity>
        </UiEntity>
    }
}