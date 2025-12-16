import { LineName, getRandomLine } from './LineManager'
import { ServiceAlertType, ServiceDisruption } from './ServiceDisruption'
import { Station } from './StationManager'
import { getStationsForLine } from './SubwayMap'

export class GameState {
    startingLine: LineName
    startingStation: Station
    destinationStation: Station
    isFirstTurn: boolean
    isWon: boolean

    activeServiceDisruptions?: ServiceDisruption[]

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        isFirstTurn: boolean = true,
        isWon: boolean = false,

        activeServiceDisruptions = []
    ) {
        this.startingLine = startingLine
        this.startingStation = startingStation
        this.destinationStation = destinationStation
        this.isFirstTurn = isFirstTurn
        this.isWon = isWon

        this.activeServiceDisruptions = activeServiceDisruptions
    }

    public checkWin(currentStation: Station): boolean {
        if (currentStation.equals(this.destinationStation)) {
            this.isWon = true
        } else {
            this.isWon = false
        }

        return this.isWon
    }

    public async resetGameState(): Promise<void> {
        const disabledLines: LineName[] = []
        const disabledStationIDs: Set<string> = new Set<string>()

        if (this.activeServiceDisruptions) {
            this.activeServiceDisruptions.forEach((disruption) => {
                disruption.affectedStations.forEach((stationSet, line) => {
                    disabledLines.push(line)

                    stationSet.forEach((stationId) => {
                        // lol 3x forEach
                        disabledStationIDs.add(stationId)
                    })
                })
            })
        }

        const disabledStationIDsArr = Array.from(disabledStationIDs)

        this.startingLine = getRandomLine(disabledLines)
        // this.startingLine = LineName.L_TRAIN
        this.isFirstTurn = true

        this.startingStation = Station.getRandomStation(await getStationsForLine(this.startingLine))
        this.destinationStation = Station.getRandomStation(Station.allNycStations, [this.startingStation.getId(), ...disabledStationIDsArr])

        // this.destinationStation = Station.getStationByID('AQR')
    }

    public async getStartDestStationIDs(): Promise<string[]> {
        return [this.startingStation.getId(), this.destinationStation.getId()]
    }

    public isStationDisabled(stationID: string, line: LineName): boolean {
        if (!this.activeServiceDisruptions) return false

        return this.activeServiceDisruptions.some((disruption) => disruption.isStationAffected(stationID, line))
    }
}
