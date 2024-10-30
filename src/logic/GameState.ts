import { Line, LineName } from './Line'
import { Station } from './StationManager'
import { SubwayMap } from './SubwayMap'
import { Direction } from './TrainManager'

export class GameState {
    startingLine: LineName
    startingStation: Station 
    destinationStation: Station 
    currentLine: LineName
    currentDirection: Direction
    currentStation: Station 
    currentStations: Station[]
    isFirstTurn: boolean

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        currentLine: LineName = LineName.NULL_TRAIN,
        currentDirection: Direction = Direction.NULL_DIRECTION,
        currentStation: Station = Station.NULL_STATION,
        currentStations: Station[] = [Station.NULL_STATION],
        isFirstTurn: boolean = true
    ) {
        this.startingLine = startingLine;
        this.startingStation = startingStation;
        this.destinationStation = destinationStation;
        this.currentLine = currentLine;
        this.currentDirection = currentDirection
        this.currentStation = currentStation;
        this.currentStations = currentStations;
        this.isFirstTurn = isFirstTurn;
    }

    async resetGameState(): Promise<void> {
        this.startingLine = Line.getRandomLine()
        this.isFirstTurn = true
        this.currentDirection = Direction.NULL_DIRECTION

        await SubwayMap.createStations(this.startingLine, this.currentStations)

        this.startingStation = Station.getRandomStation(this.currentStations)
        do {
            this.destinationStation = Station.getRandomStation(Station.allNycStations)

        } while (this.startingStation === this.destinationStation)

        this.currentStation = this.startingStation
    }

}
