import { CarPbData } from "./CarPbData"
import { CarData } from "./carData"
import { PbData } from "./PbData"

export type TrackData = {
    guid: string
    name: string
    pb: number,
    checkpoints: number,
    targetTimeToUnlockNextTrack: number
    cars: CarData[]
    carPbsPerTrack: PbData[]
}