import { Station } from './StationManager'
import { LineName, getRandomLine } from './LineManager'
import { getStationsForLine } from './SubwayMap'
import { DisruptionService } from './DisruptionService'
import { GameConfig } from './Game'
import { GameDifficulty } from '../contexts/SettingsContext'

export class GameState {
    startingLine: LineName
    startingStation: Station
    destinationStation: Station
    isFirstTurn: boolean
    isWon: boolean

    disruptionService: DisruptionService | null = null

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        isFirstTurn: boolean = true,
        isWon: boolean = false
    ) {
        this.startingLine = startingLine
        this.startingStation = startingStation
        this.destinationStation = destinationStation
        this.isFirstTurn = isFirstTurn
        this.isWon = isWon
    }

    public checkWin(currentStation: Station): boolean {
        if (currentStation.equals(this.destinationStation)) {
            this.isWon = true
        } else {
            this.isWon = false
        }

        return this.isWon
    }

    public async initialize(config: GameConfig): Promise<void> {
        this.isFirstTurn = true
        this.isWon = false

        if (config.difficulty === GameDifficulty.NEW_YORKER) {
            this.disruptionService = new DisruptionService()
        }

        const suspendedLines: LineName[] = this.disruptionService?.getSuspendedLines() ?? []
        const disabledIdsArr = Array.from(this.disruptionService?.getDisabledStationIds() ?? [])

        this.startingLine = getRandomLine(suspendedLines)
        // this.startingLine = LineName.L_TRAIN

        const lineStations: Station[] = await getStationsForLine(this.startingLine)
        this.startingStation = Station.getRandomStation(lineStations, disabledIdsArr)
        this.destinationStation = Station.getRandomStation(Station.allNycStations, [this.startingStation.getId(), ...disabledIdsArr])

        // this.destinationStation = Station.getStationById('AQR')
    }

    public async getStartDestStationIds(): Promise<string[]> {
        return [this.startingStation.getId(), this.destinationStation.getId()]
    }

    public isStationDisabled(line: LineName, stationId: string): boolean {
        if (!stationId) return false

        return this.disruptionService?.isStationDisabled(stationId, line) ?? false
    }

    public isLineSuspended(line: LineName): boolean {
        if (!line) return false

        return this.disruptionService?.getSuspendedLines().includes(line) ?? false
    }
}
