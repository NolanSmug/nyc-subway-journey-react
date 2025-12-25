import { LineName } from './LineManager'
import { ServiceAlertType, Disruption } from './Disruption'

export class DisruptionService {
    private disruptions: Disruption[] = []

    constructor() {
        this.disruptions = this.generateDisruptions()
    }

    private generateDisruptions(): Disruption[] {
        const oneTrainDisruption = new Disruption(
            ServiceAlertType.STATION_CLOSURE,
            new Map([[LineName.ONE_TRAIN, new Set<string>(['132', 'PEN', '127'])]])
        )
        const bTrainSuspension = Disruption.suspendLine(LineName.B_TRAIN)

        return [bTrainSuspension, oneTrainDisruption]
    }

    public getSuspendedLines(): LineName[] {
        return this.disruptions
            .filter((disruption) => disruption.type === ServiceAlertType.LINE_SUSPENSION)
            .flatMap((disruption) => disruption.affectedLines)
    }

    public getDisabledStationIds(): Set<string> {
        const disabledStationIds: Set<string> = new Set<string>()

        this.disruptions.forEach((disruption) => {
            disruption.affectedStations.forEach((stationsSet) => {
                stationsSet.forEach((id) => disabledStationIds.add(id))
            })
        })

        return disabledStationIds
    }

    public isStationDisabled(stationId: string, line: LineName): boolean {
        return this.disruptions.some(
            (disruption) => disruption.type === ServiceAlertType.STATION_CLOSURE && disruption.isStationAffected(stationId, line)
        )
    }
}
