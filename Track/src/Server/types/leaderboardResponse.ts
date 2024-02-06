export type TrackBestTime = {
    guid: string
    pb: number
}

export type PlayerBestTimes = {
    name: string
    trackPbs: TrackBestTime[]
}

export type LeaderboardResponse = {
    result: PlayerBestTimes[]
}