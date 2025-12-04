import { LineName, getRandomLine } from './LineManager'
import { Station } from './StationManager'
import { getStationsForLine } from './SubwayMap'

export class GameState {
    startingLine: LineName
    startingStation: Station
    destinationStation: Station
    isFirstTurn: boolean
    isWon: boolean

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        isFirstTurn: boolean = true,
        isWon: boolean = false
    ) {
        this.startingLine = startingLine
        this.startingStation = startingStation
        this.destinationStation = destinationStation
        this.isFirstTurn = isFirstTurn
        this.isWon = isWon
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
        this.startingLine = getRandomLine()
        // this.startingLine = LineName.L_TRAIN
        this.isFirstTurn = true

        this.startingStation = Station.getRandomStation(await getStationsForLine(this.startingLine))
        do {
            this.destinationStation = Station.getRandomStation(Station.allNycStations)
        } while (this.startingStation.equals(this.destinationStation))
    }

    public async getStartDestStationIDs(): Promise<string[]> {
        return [this.startingStation.getId(), this.destinationStation.getId()]
    }
}
