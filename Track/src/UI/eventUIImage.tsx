import ReactEcs, { UiEntity } from "@dcl/sdk/react-ecs"
import { PlayerData } from "../Server/types/playerData"
import { ServerComms } from "../Server/serverComms"
import { RaceMenuManager } from "../RaceMenu/raceMenuManager"
import * as carConfiguration from "./../RaceMenu/carConfiguration.json"
import * as utils from '@dcl-sdk/utils'

export enum EventUIEnum {
    preEvent,
    lapEvent,
    endEvent,
    newTrackEvent,
    newCarEvent,
    competitionUnlockEvent
}

export class EventUIImage {
    static eventVisibility: boolean = false
    static loadingImage: boolean = false

    static eventsShownOrWaiting: number = 0
    static notificationTime: number = 4000

    static oldPlayerData: PlayerData = new PlayerData()

    static pointIncrease: number = 0
    static imageSource: string
    static points: string = ""
    static pointStartingLeft: number = 265

    private static component = () => (
        <UiEntity
            key="EventUI"
            uiTransform={{
                positionType: 'absolute',
                position: {
                    top: '25%',
                    right: '50%',
                },
                display: EventUIImage.eventVisibility && !EventUIImage.loadingImage ? 'flex' : 'none',
            }}
        >
            <UiEntity
                key="EventUIImage"
                uiTransform={{
                    position: {
                        left: 256
                    },
                    width: 512,
                    height: 512,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/ui/events/" + EventUIImage.imageSource,
                        wrapMode: 'repeat'
                    }
                }}
            >
            </UiEntity>
            <UiEntity
                key="PointsUIImagePlus"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        left: EventUIImage.pointStartingLeft,
                        top: 295
                    },
                    width: 75,
                    height: 75,
                    display: EventUIImage.points.length > 0 ? 'flex' : 'none',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/ui/numbersSpriteSheet.png",
                        wrapMode: 'clamp'
                    },
                    uvs: EventUIImage.getCharacterUVs("+")
                }}
            >
            </UiEntity>
            <UiEntity
                key="PointsUIImage0"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        left: EventUIImage.pointStartingLeft + 51.2,
                        top: 295
                    },
                    width: 75,
                    height: 75,
                    display: EventUIImage.points.length > 0 ? 'flex' : 'none',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/ui/numbersSpriteSheet.png",
                        wrapMode: 'clamp'
                    },
                    uvs: EventUIImage.getDigitUVs(0)
                }}
            >
            </UiEntity>
            <UiEntity
                key="PointsUIImage1"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        left: EventUIImage.pointStartingLeft + (2 * 51.2),
                        top: 295
                    },
                    width: 75,
                    height: 75,
                    display: EventUIImage.points.length > 1 ? 'flex' : 'none',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/ui/numbersSpriteSheet.png",
                        wrapMode: 'clamp'
                    },
                    uvs: EventUIImage.getDigitUVs(1)
                }}
            >
            </UiEntity>
            <UiEntity
                key="PointsUIImage2"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        left: EventUIImage.pointStartingLeft + (3 * 51.2),
                        top: 295
                    },
                    width: 75,
                    height: 75,
                    display: EventUIImage.points.length > 2 ? 'flex' : 'none',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/ui/numbersSpriteSheet.png",
                        wrapMode: 'clamp'
                    },
                    uvs: EventUIImage.getDigitUVs(2)
                }}
            >
            </UiEntity>
            <UiEntity
                key="PointsUIImage3"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        left: EventUIImage.pointStartingLeft + (4 * 51.2),
                        top: 295
                    },
                    width: 75,
                    height: 75,
                    display: EventUIImage.points.length > 3 ? 'flex' : 'none',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/ui/numbersSpriteSheet.png",
                        wrapMode: 'clamp'
                    },
                    uvs: EventUIImage.getDigitUVs(3)
                }}
            >
            </UiEntity>
            <UiEntity
                key="PointsUIImagePoints"
                uiTransform={{
                    positionType: 'absolute',
                    position: {
                        left: EventUIImage.pointStartingLeft + ((EventUIImage.points.length + 1) * 51.2) + 20,
                        top: 288
                    },
                    width: 230,
                    height: 80,
                    display: EventUIImage.points.length > 0 ? 'flex' : 'none',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "images/ui/numbersSpriteSheet.png",
                        wrapMode: 'clamp'
                    },
                    uvs: EventUIImage.getCharacterUVs("points")
                }}
            >
            </UiEntity>
        </UiEntity>
    )

    static Render() {
        return [
            EventUIImage.component()
        ]
    }

    static triggerEvent(_event: EventUIEnum): void {
        utils.timers.setTimeout(() => {
            EventUIImage.loadingImage = true
            utils.timers.setTimeout(() => {
                EventUIImage.loadingImage = false
            }, 250)
            EventUIImage.points = ""
            EventUIImage.eventVisibility = true
            switch (_event) {
                case EventUIEnum.preEvent:
                    EventUIImage.imageSource = this.getPreEventImage()
                    break
                case EventUIEnum.competitionUnlockEvent:
                    EventUIImage.imageSource = this.getCompetionUnlockEventImage()
                    break
                case EventUIEnum.endEvent:
                    EventUIImage.imageSource = this.getEndEventImage()
                    break
                case EventUIEnum.lapEvent:
                    EventUIImage.imageSource = this.getLapEventImage()
                    break
                case EventUIEnum.newCarEvent:
                    EventUIImage.imageSource = this.getNewCarEventImage()
                    break
                case EventUIEnum.newTrackEvent:
                    EventUIImage.imageSource = this.getNewTrackEventImage()
                    break
            }
        }, EventUIImage.notificationTime * EventUIImage.eventsShownOrWaiting)

        utils.timers.setTimeout(() => {
            EventUIImage.eventVisibility = false
            EventUIImage.eventsShownOrWaiting -= 1
        }, (EventUIImage.notificationTime * EventUIImage.eventsShownOrWaiting) + EventUIImage.notificationTime + (_event == EventUIEnum.preEvent ? 2000 : 0))

        EventUIImage.eventsShownOrWaiting += 1
    }

    static comparePlayerData(_trackGuid: string, _carGuid: string) {
        EventUIImage.pointIncrease = ServerComms.player.points - EventUIImage.oldPlayerData.points

        if (EventUIImage.pointIncrease == 0) {
            // Did the pb get quicker?
            let oldPB: number = 0
            let newPB: number = 0

            EventUIImage.oldPlayerData.tracks.forEach(track => {
                if (track.guid == _trackGuid) {
                    for (let carPB of track.carPbsPerTrack) {
                        if (carPB.car == _carGuid) {
                            oldPB = carPB.PB
                        }
                    }
                }
            });
            ServerComms.player.tracks.forEach(track => {
                if (track.guid == _trackGuid) {
                    for (let carPB of track.carPbsPerTrack) {
                        if (carPB.car == _carGuid) {
                            newPB = carPB.PB
                            if (newPB < track.targetTimeToUnlockNextTrack/1000 && newPB != 0) {
                                newPB = -1 // we want it to say "well done" when we get the qualification time or lower, even if we don't break our PB
                            }
                        } 
                    }
                }
            });

            if (newPB < oldPB) {
                EventUIImage.pointIncrease = -1 // We'll use this later
            }
        }

        EventUIImage.triggerEvent(EventUIEnum.endEvent)

        // Check for track unlock
        let numberOfTracksUnlockedForCurrentCar_old: number = 0
        let numberOfTracksUnlockedForCurrentCar_new: number = 0

        for (let track of EventUIImage.oldPlayerData.tracks) {
            for (let car of track.cars) {
                if (car.guid == _carGuid) {
                    numberOfTracksUnlockedForCurrentCar_old++
                }
            }
        }

        for (let track of ServerComms.player.tracks) {
            for (let car of track.cars) {
                if (car.guid == _carGuid) {
                    numberOfTracksUnlockedForCurrentCar_new++
                }
            }
        }

        if (numberOfTracksUnlockedForCurrentCar_new > numberOfTracksUnlockedForCurrentCar_old) {
            EventUIImage.triggerEvent(EventUIEnum.newTrackEvent)
        }

        if (ServerComms.player.cars.length > EventUIImage.oldPlayerData.cars.length) {
            EventUIImage.triggerEvent(EventUIEnum.newCarEvent)
        }
    }

    private static getPreEventImage(): string {
        return "msg_instructions.png"
    }

    private static getLapEventImage(): string {
        return "2D_lapCompleted.png"
    }

    private static getEndEventImage(): string {
        if (EventUIImage.pointIncrease > 0) {

            EventUIImage.animatePointIncrease()

            return "msg_wellDone.png"
        } else {
            // But did the pb get quicker?
            if (EventUIImage.pointIncrease == -1) { // No new points but got under qualification
                return "2D_wellDone.png"
            } else {
                return "msg_tryAgain.png"
            }
        }

    }

    private static animatePointIncrease(): void {
        EventUIImage.points = ""

        utils.timers.setTimeout(() => {
            for (let i: number = 1; i < 21; i++) {
                utils.timers.setTimeout(() => {
                    EventUIImage.points = Math.floor((EventUIImage.pointIncrease / 20) * i).toString()
                    if (i == 20) {
                        EventUIImage.points = EventUIImage.pointIncrease.toString()
                    }
                    EventUIImage.pointStartingLeft = 265 + ((4 - EventUIImage.points.length) * 20)
                }, 50 * i)
            }
        }, 250)
    }

    private static getNewTrackEventImage(): string {

        let selectedCarIndex = RaceMenuManager.instance.carButton1.selected ? 0 : (RaceMenuManager.instance.carButton2.selected ? 1 : 2)
        let selectedCarGuid = carConfiguration.cars[selectedCarIndex].guid

        let trackImagePath: string = ""

        // Work out which track
        ServerComms.player.tracks.forEach(track => {
            track.cars.forEach(car => {
                if (car.guid == selectedCarGuid) {
                    if (track.guid == "17e75c78-7f17-4b7f-8a13-9d1832ec1231") {
                        trackImagePath = "msg_unlockedTrack2.png"
                    }
                    else if (track.guid == "ec2a8c30-678a-4d07-b56e-7505ce8f941a") {
                        trackImagePath = "msg_unlockedTrack3.png"
                    }
                    else if (track.guid == "a8ceec44-5a8f-4c31-b026-274c865ca689") {
                        trackImagePath = "msg_unlockedTrack4.png"
                    }
                }
            })
        })
        return trackImagePath
    }

    private static getNewCarEventImage(): string {
        // Work out which car
        switch (ServerComms.player.cars.length) {
            case 2:
                return "msg_unlockedCar2.png"
            case 3:
                return "msg_unlockedCar3.png"
            default: return ""
        }
    }

    private static getCompetionUnlockEventImage(): string {
        return "msg_unlockedCompetition.png"
    }

    private static getDigitUVs(_index: number): number[] {
        switch (_index) {
            case 0: {
                if (EventUIImage.points.length > 0) {
                    return EventUIImage.getCharacterUVs(EventUIImage.points[0])
                }
            }
            case 1: {
                if (EventUIImage.points.length > 1) {
                    return EventUIImage.getCharacterUVs(EventUIImage.points[1])
                }
            }
            case 2: {
                if (EventUIImage.points.length > 2) {
                    return EventUIImage.getCharacterUVs(EventUIImage.points[2])
                }
            }
            case 3: {
                if (EventUIImage.points.length > 3) {
                    return EventUIImage.getCharacterUVs(EventUIImage.points[3])
                }
            }
        }
        return EventUIImage.getUVs(0, 1, 0, 1)
    }

    private static getCharacterUVs(_character: string): number[] {
        switch (_character) {
            case "0": return EventUIImage.getUVs(0, 0.2, 0, 0.33)
            case "1": return EventUIImage.getUVs(0.2, 0.4, 0, 0.33)
            case "2": return EventUIImage.getUVs(0.4, 0.6, 0, 0.33)
            case "3": return EventUIImage.getUVs(0.6, 0.8, 0, 0.33)
            case "4": return EventUIImage.getUVs(0.8, 1, 0, 0.33)
            case "5": return EventUIImage.getUVs(0, 0.2, 0.33, 0.67)
            case "6": return EventUIImage.getUVs(0.2, 0.4, 0.33, 0.67)
            case "7": return EventUIImage.getUVs(0.4, 0.6, 0.33, 0.67)
            case "8": return EventUIImage.getUVs(0.6, 0.8, 0.33, 0.67)
            case "9": return EventUIImage.getUVs(0.8, 1, 0.33, 0.67)
            case "+": return EventUIImage.getUVs(0, 0.2, 0.64, 1)
            case "points": return EventUIImage.getUVs(0.25, 1, 0.64, 1)
        }
        return EventUIImage.getUVs(0, 1, 0, 1)
    }

    private static getUVs(_minX: number, _maxX: number, _minY: number, _maxY: number): number[] {
        const minX = _minX
        const maxX = _maxX
        const minY = 1 - _maxY
        const maxY = 1 - _minY
        return [
            minX, minY,
            minX, maxY,
            maxX, maxY,
            maxX, minY,
        ]
    }
}