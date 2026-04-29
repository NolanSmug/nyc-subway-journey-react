import { LineName } from './LineManager'
import { Station } from './StationManager'

export type SubwayData = Record<string, Station[]>

let subwayMapData: SubwayData | null = null
let masterStationList: Station[] = []
let fetchPromise: Promise<void> | null = null

export function initializeSubwayData(): Promise<void> {
    if (subwayMapData) return Promise.resolve()

    if (!fetchPromise) {
        fetchPromise = (async () => {
            const data: SubwayData = await (await fetch('/data/subway_data.json')).json()
            const unique: Map<string, Station> = new Map()

            for (const line in data) {
                data[line] = data[line].map((s: any) => {
                    const station = new Station(s.id, s.name, s.transfers, s.borough)
                    unique.set(s.id, station) // need to store each unique station for getRandomDestination() to be fair
                    return station
                })
            }

            subwayMapData = data
            masterStationList = Array.from(unique.values())
        })()
    }

    return fetchPromise
}

export function getStationsForLine(line: LineName): Station[] {
    if (!subwayMapData) throw new Error('Subway data not initialized')
    return subwayMapData[line] || []
}

export function getRandomStationFromLine(line: LineName, rng: () => number = Math.random): Station {
    const stations: Station[] = getStationsForLine(line)

    if (stations.length === 0) throw new Error(`No stations found for line: ${line}`)

    return stations[Math.floor(rng() * stations.length)]
}

export function getRandomDestination(rng: () => number = Math.random): Station {
    if (masterStationList.length === 0) throw new Error('Subway data not initialized')
    return masterStationList[Math.floor(rng() * masterStationList.length)]
}
