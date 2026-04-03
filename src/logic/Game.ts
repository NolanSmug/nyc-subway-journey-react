import { DailyChallenge } from './DailyChallenge'
import { Direction } from './LineManager'
import { Journey } from './Journey'
import { Score } from './Score'
import { SeedRNG } from './SeedRNG'
import { Train } from './TrainManager'
import { getStationsForLine } from './SubwayMap'

export class Game {
    public journey: Journey
    public train: Train

    constructor() {
        this.journey = new Journey()
        this.train = new Train()
    }

    public async runGame(isDailyChallenge: boolean): Promise<void> {
        this.journey.isDailyChallengeCompleted = DailyChallenge.isAlreadyCompleted()

        const rng = isDailyChallenge
            ? (() => {
                  const seed = new SeedRNG(new Date().toDateString())
                  return () => seed.next()
              })()
            : Math.random

        await this.journey.resetJourney(rng)

        this.train.setDirection(Direction.NULL_DIRECTION)
        this.train.setScheduledStops(await getStationsForLine(this.journey.startingLine))
        this.train.setCurrentStation(this.journey.startingStation)
        this.train.setLine(this.journey.startingLine)
    }

    public async fetchDailyScore(): Promise<Score | null> {
        const [startID, destID] = this.journey.getStartDestStationIDs()
        return await DailyChallenge.getOptimalScore(startID, destID)
    }
}
