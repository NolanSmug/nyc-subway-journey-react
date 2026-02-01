import { GameState } from './GameState'
import { Train } from './TrainManager'
import { Direction } from './LineManager'
import { getStationsForLine } from './SubwayMap'
import { SeedRNG } from './SeedRNG'
import { DailyChallenge } from './DailyChallenge'

export class Game {
    public gameState: GameState
    public train: Train

    constructor() {
        this.gameState = new GameState()
        this.train = new Train()
    }

    public async runGame(isDailyChallenge: boolean): Promise<void> {
        this.gameState.isDailyChallengeCompleted = DailyChallenge.isAlreadyCompleted()

        const rng = isDailyChallenge
            ? (() => {
                  const seed = new SeedRNG(new Date().toDateString())
                  return () => seed.next()
              })()
            : Math.random

        await this.gameState.resetGameState(rng)

        if (isDailyChallenge) {
            const [startID, destID] = this.gameState.getStartDestStationIDs()
            this.gameState.optimalScore = await DailyChallenge.getOptimalScore(startID, destID)
        }

        this.train.setDirection(Direction.NULL_DIRECTION)
        this.train.setScheduledStops(await getStationsForLine(this.gameState.startingLine))
        this.train.setCurrentStation(this.gameState.startingStation)
        this.train.setLine(this.gameState.startingLine)
    }
}
