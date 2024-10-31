import { GameState } from './GameState'
import { Line } from './Line'
import { Station } from './StationManager'
import { SubwayMap } from './SubwayMap'
import { Train, Direction } from './TrainManager'

export class Game {
    public gameState: GameState
    public train: Train

    constructor() {
        this.gameState = new GameState()
        this.train = new Train()
    }

    public async runGame(): Promise<void> {
        await this.resetGameState() // fill gameState with new params

        this.train.setLine(this.gameState.startingLine)
        this.train.setDirection(this.train.getRandomDirection())
        this.train.setScheduledStops(this.gameState.currentStations)
        this.train.setCurrentStation(this.gameState.startingStation)
        this.train.setLineType()
        this.train.updateTrainState()
    }

    async resetGameState(): Promise<void> {
        this.gameState.startingLine = Line.getRandomLine()
        this.gameState.isFirstTurn = true
        this.gameState.isWon = false
        this.train.setDirection(Direction.NULL_DIRECTION)

        await SubwayMap.createStations(this.gameState.startingLine, this.gameState.currentStations)

        this.gameState.startingStation = Station.getRandomStation(this.gameState.currentStations)
        do {
            this.gameState.destinationStation = Station.getRandomStation(Station.allNycStations)

        } while (this.gameState.startingStation === this.gameState.destinationStation)

        this.train.setCurrentStation(this.gameState.startingStation)
    }
}
