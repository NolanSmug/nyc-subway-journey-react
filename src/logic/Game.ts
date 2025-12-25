import { GameState } from './GameState'
import { Train } from './TrainManager'
import { Direction } from './LineManager'
import { getStationsForLine } from './SubwayMap'
import { GameDifficulty } from '../contexts/SettingsContext'

export interface GameConfig {
    difficulty: GameDifficulty
}

export class Game {
    public gameState: GameState
    public train: Train
    private config: GameConfig

    constructor(config: GameConfig) {
        this.gameState = new GameState()
        this.train = new Train()
        this.config = config
    }

    public async runGame(): Promise<void> {
        await this.gameState.initialize(this.config)

        this.train.setDirection(Direction.NULL_DIRECTION)
        this.train.setScheduledStops(await getStationsForLine(this.gameState.startingLine))
        this.train.setCurrentStation(this.gameState.startingStation)
        this.train.setLine(this.gameState.startingLine)
        // this.train.updateTrainState()
    }
}
