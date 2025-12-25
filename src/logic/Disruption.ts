import { LineName } from './LineManager'

export enum ServiceAlertType {
    DELAYS = 'Delays',
    STATION_CLOSURE = 'Station closure',
    LINE_SUSPENSION = 'Line suspension',
}

export class Disruption {
    constructor(
        public type: ServiceAlertType,
        public affectedStations: Map<LineName, Set<string>> = new Map(),
        public suspendedLines?: LineName[]
    ) {}

    get affectedLines(): LineName[] {
        return Array.from(this.affectedStations.keys())
    }

    public isStationAffected(stationId: string, line: LineName): boolean {
        const stationsOnLine = this.affectedStations.get(line)
        return stationsOnLine ? stationsOnLine.has(stationId) : false
    }

    public static suspendLine(line: LineName) {
        return new Disruption(ServiceAlertType.LINE_SUSPENSION, new Map([[line, new Set<string>()]]))
    }
}
