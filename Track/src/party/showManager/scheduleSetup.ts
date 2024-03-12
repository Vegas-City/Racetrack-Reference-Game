import { IntermissionSubs } from './subtitle-files/IntermissionSubs'
import * as showMgmt from 'show-manager/src'
import * as showConfig from './showConfig.json'

export const DEFAULT_VIDEO = showConfig.defaultVideo

// Video schedule     

const defaultShow: showMgmt.ShowType = {
    id: -1,
    title: 'Intermission',
    artist: 'Intermission',
    link: DEFAULT_VIDEO,
    subs: IntermissionSubs,
    startTime: -1,
    length: 17,
    loop: true
}

let idx: number = 0
export const shows: showMgmt.ShowType[] = getShows()


export const showData: showMgmt.ShowDataType = {
    defaultShow: defaultShow,
    shows: shows
}

function getShows(): showMgmt.ShowType[] {
    const showsArray: showMgmt.ShowType[] = []

    // Set up the show details below. Length is the length of the show in seconds
    for (let show of showConfig.shows) {
        idx++
        showsArray.push(
            {
                id: idx,
                title: show.title,
                artist: '',
                link: show.link,
                subs: IntermissionSubs,
                startTime: Date.UTC(show.startDate_UTC.year, show.startDate_UTC.month - 1, show.startDate_UTC.day, show.startDate_UTC.hour, show.startDate_UTC.minute, show.startDate_UTC.second) / 1000,
                length: (show.duration.hours * 3600) + (show.duration.minutes * 60) + show.duration.seconds
            },
            defaultShow
        )
    }

    return showsArray
}