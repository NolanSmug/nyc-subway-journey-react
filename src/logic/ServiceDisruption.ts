import { LineName } from './LineManager'

export enum ServiceAlertType {
    DELAYS = 'Delays',
    STATION_CLOSURE = 'Station Closure',
}

export class ServiceDisruption {
    public type: ServiceAlertType
    public affectedStations: Map<LineName, Set<string>> = new Map()

    constructor(type: ServiceAlertType, stations?: Map<LineName, Set<string>>) {
        this.type = type
        if (stations) this.affectedStations = stations
    }

    get affectedLines(): LineName[] {
        return Array.from(this.affectedStations.keys()) ?? [LineName.NULL_TRAIN]
    }

    public isLineAffected(line: LineName): boolean {
        return this.affectedStations.has(line)
    }

    public isStationAffected(stationID: string, line: LineName): boolean {
        const stationsOnLine = this.affectedStations.get(line)

        return stationsOnLine ? stationsOnLine.has(stationID) : false
    }

    static isStationClosed(disruptions: ServiceDisruption[], stationID: string, line: LineName): boolean {
        if (!disruptions || disruptions.length === 0) return false

        return disruptions.some(
            (disruption) => disruption.type === ServiceAlertType.STATION_CLOSURE && disruption.isStationAffected(stationID, line)
        )
    }

    public static generateDisruptions(): ServiceDisruption[] {
        const oneTrainShit: ServiceDisruption = new ServiceDisruption(
            ServiceAlertType.STATION_CLOSURE,
            new Map([[LineName.ONE_TRAIN, new Set(['132', 'PEN', '127'])]])
        )
        return [oneTrainShit]
    }
}
