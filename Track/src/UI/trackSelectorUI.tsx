import ReactEcs, { UiEntity } from "@dcl/sdk/react-ecs"
import { Scene } from "../scene"

export class TrackSelectorUI {
    static trackSelectorUIShow: boolean = true

    private static component = () => (
        <UiEntity
            key="TrackSelectorUI"
            uiTransform={{
                positionType: 'absolute',
                position: {
                    top: 100,
                    left: 500,
                },
                display: TrackSelectorUI.trackSelectorUIShow ? 'flex' : 'none',
            }}
        >
            <UiEntity
                key="Track1Btn"
                uiTransform={{
                    width: 245,
                    height: 87,
                    position: {
                        left: 0,
                        bottom: 0
                    }
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/debugUI/track1.png",
                        wrapMode: 'repeat'
                    }
                }}
                onMouseDown={() => {
                    //TrackSelectorUI.trackSelectorUIShow = false
                    Scene.LoadTrack(1)
                }}
            ></UiEntity>
            <UiEntity
                key="Track2Btn"
                uiTransform={{
                    width: 245, 
                    height: 87,
                    position: { 
                        left: 50,
                        bottom: 0
                    }
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/debugUI/track2.png",
                        wrapMode: 'repeat' 
                    }
                }}
                onMouseDown={() => {
                    //TrackSelectorUI.trackSelectorUIShow = false
                    Scene.LoadTrack(2)
                }}
            ></UiEntity>
            <UiEntity
                key="Track3Btn"
                uiTransform={{
                    width: 245,
                    height: 87,
                    position: {
                        left: 100,
                        bottom: 0
                    }
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/debugUI/track3.png",
                        wrapMode: 'repeat'
                    }
                }}
                onMouseDown={() => {
                    //TrackSelectorUI.trackSelectorUIShow = false
                    Scene.LoadTrack(3)
                }}
            ></UiEntity>

        </UiEntity>
    )

    static Render() {
        return [
            TrackSelectorUI.component()
        ]
    }
}