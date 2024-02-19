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

    private currentOkTexture: string = 'textures/ui/button1-variant2.png';
    private defaultOkTexture: string = 'textures/ui/button1-variant2.png';
    private selectedOkTexture: string = 'textures/ui/button1-variant1.png';

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
                uiBackground={{ textureMode: "stretch", texture: { src: 'textures/ui/middle-window.jpg' } }}
            >
                <UiEntity
                    uiTransform={{
                        positionType: 'absolute',
                        position: { top: 200 },
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
                        height: 92 / 1.4,
                        positionType: "absolute",
                        position: { top: 400, right: '30%' },
                        justifyContent: 'center'
                    }}
                    uiBackground={{ textureMode: "stretch", texture: { src: this.currentOkTexture } }}
                    onMouseDown={this.hide.bind(this)}
                >
                    <UiEntity
                        uiTransform={{
                            width: 225,
                        }}
                        uiText={{
                            value: "OK",
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
                        onMouseDown={this.hide.bind(this)}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: { src: "textures/ui/hotkeys/Button-F.png" },
                            color: Color4.create(1, 1, 1, 1)
                        }}
                    />
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
        this.currentOkTexture = this.selectedOkTexture
        utils.timers.setTimeout(() => {
            this.currentOkTexture = this.defaultOkTexture
            this._currentText = "";
            this.visible = false;
        }, 200)

    }
}