import { Line, LineName } from './Line'
import { Station } from './StationManager'
import { SubwayMap } from './SubwayMap'

export class GameState {
    startingLine: LineName
    startingStation: Station 
    destinationStation: Station 
    currentStation: Station 
    currentStations: Station[]
    isFirstTurn: boolean

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        currentStation: Station = Station.NULL_STATION,
        currentStations: Station[] = [Station.NULL_STATION],
        isFirstTurn: boolean = true
    ) {
        this.startingLine = startingLine;
        this.startingStation = startingStation;
        this.destinationStation = destinationStation;
        this.currentStation = currentStation;
        this.currentStations = currentStations;
        this.isFirstTurn = isFirstTurn;
    }

    async resetGameState(): Promise<void> {
        this.startingLine = Line.getRandomLine()
        this.isFirstTurn = true

        await SubwayMap.createStations(this.startingLine, this.currentStations)

        // this.startingStation = Station.getRandomStation(this.currentStations)
        this.startingStation = this.currentStations[0]
        do {
            this.destinationStation = Station.getRandomStation(Station.allNycStations)
        } while (this.startingStation === this.destinationStation)

        this.currentStation = this.startingStation
    }

}
