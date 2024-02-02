import ReactEcs, { Label, UiEntity } from "@dcl/sdk/react-ecs"
import { Car } from "@vegascity/racetrack/src/car"
import { Color4 } from "@dcl/sdk/math"

export class DebugUI {

    static debugUIShow: boolean = false

    private static component = () => (
        <UiEntity
            key="DebugUI"
            uiTransform={{
                positionType: 'absolute',
                position: {
                    top: 100,
                    right: 0,
                },
                display: DebugUI.debugUIShow ? 'none' : 'none',

            }}
        >
            <UiEntity
                key="BackGroundUI"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        top: 260,
                        right: 90,
                    },
                    width: "430",
                    height: "700",
                    display: DebugUI.debugUIShow ? 'flex' : 'none',

                }}
                uiBackground={{
                    color: Color4.fromInts(1, 1, 1, 190)
                }}
            ></UiEntity>
            <UiEntity
                key="MaxSpeedRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 300,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="MaxSpeedMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.maxSpeed -= 1
                    }}
                >
                </UiEntity>
                <Label
                    key="MaxSpeedLabel"
                    value="Max Speed"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="MaxSpeedValue"
                    value={Car.instances[0].carAttributes.maxSpeed + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="MaxSpeedPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.maxSpeed += 1
                    }}
                >
                </UiEntity>
            </UiEntity>


            <UiEntity
                key="MinSpeedRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 375,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="MinSpeedMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.minSpeed -= 1
                    }}
                >
                </UiEntity>
                <Label
                    key="MinSpeedLabel"
                    value="Min Speed"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="MinSpeedValue"
                    value={Car.instances[0].carAttributes.minSpeed + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="MinSpeedPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.minSpeed += 1
                    }}
                >
                </UiEntity>
            </UiEntity>

            <UiEntity
                key="AccelerationFRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 450,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="AccelerationFMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.accelerationF -= 1
                    }}
                >
                </UiEntity>
                <Label
                    key="AccelerationFLabel"
                    value="Forward Acceleration"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="AccelerationFValue"
                    value={Car.instances[0].carAttributes.accelerationF + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="AccelerationFPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.accelerationF += 1
                    }}
                >
                </UiEntity>
            </UiEntity>

            <UiEntity
                key="AccelerationBRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 525,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="AccelerationBMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.accelerationB -= 1
                    }}
                >
                </UiEntity>
                <Label
                    key="AccelerationBLabel"
                    value="Backward Acceleration"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="AccelerationBValue"
                    value={Car.instances[0].carAttributes.accelerationB + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="AccelerationBPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.accelerationB += 1
                    }}
                >
                </UiEntity>
            </UiEntity>



            <UiEntity
                key="DecelerationRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 600,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="DecelerationMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.deceleration -= 1
                    }}
                >
                </UiEntity>
                <Label
                    key="DecelerationLabel"
                    value="Deceleration"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="DecelerationValue"
                    value={Car.instances[0].carAttributes.deceleration + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="DecelerationPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.deceleration += 1
                    }}
                >
                </UiEntity>
            </UiEntity>

            <UiEntity
                key="SteerRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 675,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="SteerMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.steerSpeed -= 0.5
                    }}
                >
                </UiEntity>
                <Label
                    key="SteerLabel"
                    value="Steer Speed"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="SteerValue"
                    value={Car.instances[0].carAttributes.steerSpeed + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="SteerPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.steerSpeed += 0.5
                    }}
                >
                </UiEntity>
            </UiEntity>

            <UiEntity
                key="GripRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 750,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="GripMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.grip -= 0.5
                    }}
                >
                </UiEntity>
                <Label
                    key="GripLabel"
                    value="Grip"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="GripValue"
                    value={Car.instances[0].carAttributes.grip + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="GripPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].carAttributes.grip += 0.5
                    }}
                >
                </UiEntity>
            </UiEntity>

            <UiEntity
                key="MassRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 825,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <UiEntity
                    key="MassMinus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 0,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/minus.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].mass -= 10
                    }}
                >
                </UiEntity>
                <Label
                    key="MassLabel"
                    value="Mass"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -90,
                            left: 150
                        },
                    }}>
                </Label>
                <Label
                    key="MassValue"
                    value={Car.instances[0].mass + ""}
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -60,
                            left: 150
                        },
                    }}
                >
                </Label>
                <UiEntity
                    key="MassPlus"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].mass += 10
                    }}
                >
                </UiEntity>
            </UiEntity>
            <UiEntity
                key="PerspectiveRow"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        right: 0,
                        top: 900,
                    },
                    height: 200,
                    width: 500
                }}
            >
                <Label
                    key="PerspectiveLabel"
                    value="Toggle First Person"
                    fontSize={20}
                    font="monospace"
                    textAlign="middle-center"
                    uiTransform={{
                        position: {
                            top: -73,
                            left: 150
                        },
                    }}>
                </Label>
                <UiEntity
                    key="PerspectiveButton"
                    uiTransform={{
                        width: 98 / 2,
                        height: 97 / 2,
                        position: {
                            left: 300,
                            bottom: 0
                        }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "images/debugUI/add.png",
                            wrapMode: 'repeat'
                        }
                    }}
                    onMouseDown={() => {
                        Car.instances[0].thirdPersonView = !Car.instances[0].thirdPersonView
                        Car.instances[0].switchToCarPerspective()
                    }}
                >
                </UiEntity>
            </UiEntity>


        </UiEntity>
    )

    static Render() {
        if (Car.instances.length > 0) {
            return [
                DebugUI.component()
            ]
        }
    }
}