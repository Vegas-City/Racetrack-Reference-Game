export type PlayerPB = {
    walletAddress: string
    user: string
    time: number
}

export type TrackPBs = {
    guid: string
    trackName: string
    scores: PlayerPB[]
}

export class LeaderboardData {
    result: TrackPBs[]
}