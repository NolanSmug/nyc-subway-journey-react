import { LineName, getRandomLine } from './LineManager'
import { Score } from './Score'
import { Station } from './StationManager'
import { getRandomDestination, getRandomStationFromLine } from './subwayMap'

export class Journey {
    startingLine: LineName
    startingStation: Station
    destinationStation: Station
    isFirstTurn: boolean
    isWon: boolean
    playerScore: Score
    optimalScore: Score | null

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        isFirstTurn: boolean = true,
        isWon: boolean = false,
        playerScore: Score = new Score(0, 0),
        optimalScore: Score | null = null
    ) {
        this.startingLine = startingLine
        this.startingStation = startingStation
        this.destinationStation = destinationStation
        this.isFirstTurn = isFirstTurn
        this.isWon = isWon
        this.playerScore = playerScore
        this.optimalScore = optimalScore
    }

    public checkWin(currentStation: Station): boolean {
        return currentStation.equals(this.destinationStation)
    }

    public resetJourney(rng: () => number = Math.random): void {
        this.optimalScore = null
        this.startingLine = getRandomLine(rng)
        this.isFirstTurn = true
        this.playerScore.reset()

        this.startingStation = getRandomStationFromLine(this.startingLine, rng)

        do {
            this.destinationStation = getRandomDestination(rng)
        } while (this.startingStation.equals(this.destinationStation))
    }

    public getStartDestStationIDs(): [string, string] {
        return [this.startingStation.getId(), this.destinationStation.getId()]
    }
}
