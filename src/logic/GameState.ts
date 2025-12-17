import { Station } from './StationManager'
import { LineName, getRandomLine } from './LineManager'
import { getStationsForLine } from './SubwayMap'
import { ServiceDisruption } from './ServiceDisruption'

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

    public async resetGameState(enableDisruptions: boolean = false): Promise<void> {
        let suspendedLines: LineName[] = []
        let disabledStationIDs: Set<string> = new Set<string>()

        if (enableDisruptions) {
            this.activeServiceDisruptions = ServiceDisruption.generateDisruptions()

            suspendedLines = ServiceDisruption.getSuspendedLines(this.activeServiceDisruptions)
            disabledStationIDs = ServiceDisruption.getDisabledStationIDs(this.activeServiceDisruptions)
        }

        const disabledStationIDsArr: string[] = Array.from(disabledStationIDs)

        this.startingLine = getRandomLine(suspendedLines)
        this.isFirstTurn = true
        // this.startingLine = LineName.L_TRAIN

        this.startingStation = Station.getRandomStation(await getStationsForLine(this.startingLine), disabledStationIDsArr)
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
