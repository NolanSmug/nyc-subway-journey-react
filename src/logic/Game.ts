import { GameState } from './GameState'
import { Train } from './TrainManager'
import {Direction} from './EnumManager'

export class Game {
    public gameState: GameState
    public train: Train

    constructor() {
        this.gameState = new GameState()
        this.train = new Train()
    }

    public async runGame(): Promise<void> {
        await this.gameState.resetGameState() // fill gameState with new params

        this.train.setScheduledStops(this.gameState.currentStations)
        this.train.setDirection(Direction.NULL_DIRECTION)
        this.train.setLine(this.gameState.startingLine)
        this.train.setLineType()
        this.train.setCurrentStation(this.gameState.startingStation)
        this.train.updateTrainState()
    }
}
