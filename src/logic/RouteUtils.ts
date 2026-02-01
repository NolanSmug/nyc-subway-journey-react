import { areLineSetsEqual, LineName } from './LineManager'

export interface StationData {
    id: string
    name: string
    lines: LineName[]
    color: string
}

export async function fetchShortestPath(start: string, dest: string, signal?: AbortSignal): Promise<StationData[]> {
    const baseURL =
        process.env.REACT_APP_USE_DEV_API === 'true'
            ? process.env.REACT_APP_OPTIMAL_ROUTE_DEV_API
            : process.env.REACT_APP_OPTIMAL_ROUTE_PROD_API
    const endpoint: string = `${baseURL}/${start}/${dest}`

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal,
    })

    // console.log(response)

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    const data: StationData[] = await response.json()
    return data
}

export function getTransferIndices(routeData: StationData[]): number[] {
    const indices: number[] = []
    let prevLines: LineName[] = [LineName.NULL_TRAIN]

    for (let i = 0; i < routeData.length - 1; i++) {
        if (!areLineSetsEqual(routeData[i].lines, prevLines)) {
            indices.push(i)
            prevLines = routeData[i].lines
        }
    }

    return indices
}
