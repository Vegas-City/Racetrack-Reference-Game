import { CarData } from "./carData"
import { TrackData } from "./trackData"

export type PlayerData = {
    name: string
    points: number
    cars: CarData[]
    tracks: TrackData[]
}