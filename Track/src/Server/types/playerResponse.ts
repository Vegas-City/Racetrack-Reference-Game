export type CarData = {
    guid: string
    name: string
}

export type TrackData = {
    guid: string
    name: string
    pb: number,
    checkpoints: number,
    targetTimeToUnlockNextTrack: number
}

export type PlayerResponse = {
    name: string
    points: number
    cars: CarData[]
    tracks: TrackData[]
}