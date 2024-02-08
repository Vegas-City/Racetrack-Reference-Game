import { CarData } from "./carData"
import { TrackData } from "./trackData"

export type PlayerResponse = {
    name: string
    points: number
    cars: CarData[]
    tracks: TrackData[]
}