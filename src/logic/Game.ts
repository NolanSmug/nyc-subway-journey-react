import { GameState } from './GameState'
import { Train } from './TrainManager'
import { Direction } from './EnumManager'

// I didn't read the game state stuff too hard but I think it's pretty confusing
// and I don't know how your going to unit test it. Take all of the dom stuff
// out of the game state, hide all the internal state with private, and then 
// make a clearly defined set of top level methods to change it. That way game state
// changes become pure, you can replay them in tests and your ui logic is separate.
//
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
