import { Color4 } from '@dcl/sdk/math';
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import * as utils from '@dcl-sdk/utils'
import { InputAction, PointerEventType, engine, inputSystem } from '@dcl/sdk/ecs';
import { Scene } from '../scene';


export default class Popup {

    private visible: boolean = false;
    private _currentText: string = "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.\nDonec auctor, nisl eget lacinia lacinia.";
    public get currentText() {
        return this._currentText
    }

    private currentOkTexture: string = 'images/ui/wearablesUI/2d_cancel.png';

    constructor() {
        const self = this
        engine.addSystem(() => {
            if (!self.visible) return
            const cmd1 = inputSystem.getInputCommand(
                InputAction.IA_PRIMARY,
                PointerEventType.PET_DOWN,
            )
            const cmd2 = inputSystem.getInputCommand(
                InputAction.IA_SECONDARY,
                PointerEventType.PET_DOWN,
            )
            if (cmd1) {
                self.hide()
                return
            }
        })
    }


    public render() {
        return <UiEntity
            key='popup'
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
                    width: 926 / 1.4,
                    height: 784 / 1.4,
                    positionType: "absolute",
                    position: { top: 200 },
                    display: this.visible ? 'flex' : 'none',
                    justifyContent: 'center',
                }}
                uiBackground={{ textureMode: "stretch", texture: { src: 'images/ui/wearablesUI/2d_forAnyText.png'  } }}
            >
                <UiEntity
                    uiTransform={{
                        positionType: 'absolute',
                        position: { top: 230 },
                        display: this.visible ? 'flex' : 'none'
                    }}
                    uiText={{
                        value: this._currentText,
                        textAlign: "middle-center",
                        fontSize: 25,
                        color: Color4.White()
                    }}
                />

                <UiEntity
                    uiTransform={{
                        width: 348 / 1.4,
                        height: 292 / 1.4,
                        positionType: "absolute",
                        position: { top: 250, right: '30%' },
                        justifyContent: 'center'
                    }}
                    uiBackground={{ textureMode: "stretch", texture: { src: this.currentOkTexture } }}
                    onMouseDown={this.hide.bind(this)}
                >
                </UiEntity>


            </UiEntity>
        </UiEntity>
    }


    public show(text: string) {
        let paragraphs = text.split("\n");
        let lines = [];

        for (let str of paragraphs) {
            while (str.length > 0) {
                if (str.length > 30) {
                    let i = str.substring(0, 30).lastIndexOf(" ");
                    if (i > 20) {
                        lines.push(str.substring(0, i).trim());
                        str = str.substring(i).trim();
                    }
                    else {
                        lines.push(str.substring(0, 30));
                        str = str.substring(30);
                    }
                }
                else {
                    lines.push(str);
                    break;
                }
            }
        }
        this._currentText = lines.join('\n');
        this.visible = true;
    }

    public hide() {
        utils.timers.setTimeout(() => {
            
            this._currentText = "";
            this.visible = false;
        }, 200)

    }
}