import { Color4 } from "@dcl/ecs-math"
import { Label, ReactEcs, UiEntity } from "@dcl/react-ecs"
import { ServerComms } from "../Server/serverComms"
import { Scene } from "../scene"

export class PointsUi {
    private static readonly SCALE: number = 0.25

    private static component = () => (
        <UiEntity
            key="PointsUI"

            uiTransform={{
                positionType: 'absolute',
                position: {
                    top: '30%',
                    left: '1%',
                },
                width: 1208 * PointsUi.SCALE,
                height: 256 * PointsUi.SCALE,
                display: Scene.loaded ? 'flex' : 'none'
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: "images/ui/timeUI/pbBg.png",
                    wrapMode: 'repeat'
                }
            }}
        >
            <Label
                value={"Points"}
                color={Color4.White()}
                fontSize={20}
                font="sans-serif"
                textAlign="top-center"
                uiTransform={{
                    position: { left: '160px', top: '10px' }
                }}
            />
            <Label
                value={ServerComms.player ? ServerComms.player.points.toString() : "0"}
                color={Color4.White()}
                fontSize={22}
                font="sans-serif"
                textAlign="top-center"
                uiTransform={{
                    position: { left: '230px', top: '10px' }
                }}
            />
        </UiEntity>
    )

    static Render() {
        return [
            PointsUi.component()
        ]
    }
}