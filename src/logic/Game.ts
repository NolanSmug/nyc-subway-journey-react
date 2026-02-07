import { GameState } from './GameState'
import { Train } from './TrainManager'
import { Direction } from './LineManager'
import { getStationsForLine } from './SubwayMap'
import { SeedRNG } from './SeedRNG'
import { DailyChallenge } from './DailyChallenge'
import { Score } from './Score'

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

        this.train.setDirection(Direction.NULL_DIRECTION)
        this.train.setScheduledStops(await getStationsForLine(this.gameState.startingLine))
        this.train.setCurrentStation(this.gameState.startingStation)
        this.train.setLine(this.gameState.startingLine)
    }

    public async fetchDailyScore(): Promise<Score | null> {
        const [startID, destID] = this.gameState.getStartDestStationIDs()
        return await DailyChallenge.getOptimalScore(startID, destID)
    }
}
