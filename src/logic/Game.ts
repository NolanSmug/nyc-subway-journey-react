import { GameState } from './GameState'
import { Train } from './TrainManager'
import { Direction } from './EnumManager'

// I didn't read the game state stuff too hard but I think it's pretty confusing
// and I don't know how your going to unit test it. Take all of the dom stuff
// out of the game state, hide all the internal state with private, and then 
// make a clearly defined set of top level methods to change it. That way game state
// changes become pure, you can replay them in tests and your ui logic is separate.
//

export enum Action {
    Progress,
    SwitchDirection,
}

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

    public reset() {

    }

    public apply(action: Action): void {
        // Maybe disbatch to more specific internal function,
        // maybe not, the state is pretty simple
        
        switch (action) {
            case Action.Progress: this.applyProgressStation()
        }

    }

    private applyProgressStation(): void {

    }

    // Make available anything the ui needs to draw the game state.
    // The ui then doesn't access anything below this interface level.
    // By creating an interface here, you decouple the implementation of
    // the game from the ui, which critically means that the implementation
    // of the game can *change* independently of the ui, and the person implementing
    // the ui doesn't need to worry about the internal implementation of the 
    // game. They only need to understand and verify that they are using this
    // interface correctly, which if you do it well should be very strait
    // forward and intuitive and minimal.

    public get currentLine() {
        throw new Error("Unimplemented")
    }
    
    public get isWon() {
        return false
    }
}


function apply(actions: Action[], game: Game) {
    for (const act of actions) {
        game.apply(act)
    }
}

describe('Game setup', () => {
    const state = new Game();

    state.reset()
    const actions: Action[] = [
        Action.Progress,
        Action.Progress,
        Action.SwitchDirection
    ]

    // Or better yet
    apply(actions, state)

    // Verify expected state
    // ...
    assert(state.currentLine == LineName.Whatever)
    assert(state.isWon == false)
})
