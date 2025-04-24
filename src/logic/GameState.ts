import { LineName, getRandomLine } from './EnumManager'
import { Station } from './StationManager'
import { SubwayMap } from './SubwayMap'

export class GameState {
    startingLine: LineName
    startingStation: Station
    destinationStation: Station
    currentStations: Station[]
    isFirstTurn: boolean
    isWon: boolean

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        currentStations: Station[] = [],
        isFirstTurn: boolean = true,
        isWon: boolean = false
    ) {
        this.startingLine = startingLine
        this.startingStation = startingStation
        this.destinationStation = destinationStation
        this.currentStations = currentStations
        this.isFirstTurn = isFirstTurn
        this.isWon = isWon
    }

    public checkWin(currentStation: Station): boolean {
        if (currentStation.equals(this.destinationStation)) {
            return true
        } else {
            return false
        }
    }

    public setIsWon(isWon: boolean): GameState {
        return new GameState(
            this.startingLine,
            this.startingStation,
            this.destinationStation,
            this.currentStations,
            this.isFirstTurn,
            isWon
        )
    }

    public async resetGameState(): Promise<void> {
        this.startingLine = getRandomLine()
        // this.startingLine = LineName.F_TRAIN
        this.isFirstTurn = true

        // console.log(this.startingLine)

        await SubwayMap.createStations(this.startingLine, this.currentStations)

        this.startingStation = Station.getRandomStation(this.currentStations)
        do {
            this.destinationStation = Station.getRandomStation(Station.allNycStations)
        } while (this.startingStation === this.destinationStation)
    }

    public isEmpty(): boolean {
        return this.currentStations.length === 0
    }

    public async getStartDestStationIDs(): Promise<string[]> {
        return [this.startingStation.getId(), this.destinationStation.getId()]
    }
}
