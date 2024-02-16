import { Color4 } from "@dcl/ecs-math"
import { Label, ReactEcs,UiEntity } from "@dcl/react-ecs"
import { ServerComms } from "../Server/serverComms"

export class PointsUi{

    private static component = () => (
        <UiEntity
        key="EventUI"
        uiTransform={{
            positionType: 'absolute',
            position: {
                top: '30%',
                right: '50%',
            },
            display: 'flex',

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
                    fontSize={22}
                    font="sans-serif"
                    textAlign="top-center"
                    uiTransform={{
                        position: { left: '0px', top: '6px' }
                    }}
                />
                <Label
                    value={ServerComms.player ? ServerComms.player.points.toString() : "0"}
                    color={Color4.White()}
                    fontSize={30}
                    font="sans-serif"
                    textAlign= "top-center"
                    uiTransform={{
                        position: { left:'80px', top: '0px' }
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