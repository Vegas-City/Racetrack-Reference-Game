import { CarData } from "./carData"
import { TrackData } from "./trackData"

export class PlayerData {
    name: string
    points: number
    cars: CarData[] = []
    tracks: TrackData[] = []
}