import { LineName, LineType } from './Line'
import { Station } from './StationManager'
import { updateStopsForLine } from './SubwayMap'

export enum Direction {
    UPTOWN = 'Uptown',
    DOWNTOWN = 'Downtown',
    NULL_DIRECTION = '',
}

const lineDirections: Map<LineName, [string, string]> = new Map([
    [LineName.ONE_TRAIN, ['Downtown', 'Uptown']],
    [LineName.TWO_TRAIN, ['Brooklyn-bound', 'Bronx-bound']],
    [LineName.THREE_TRAIN, ['Brooklyn-bound', 'Bronx-bound']],
    [LineName.FOUR_TRAIN, ['Brooklyn-bound', 'Bronx-bound']],
    [LineName.FIVE_TRAIN, ['Brooklyn-bound', 'Bronx-bound']],
    [LineName.SIX_TRAIN, ['Brooklyn-Bridge-bound', 'Bronx-bound']],
    [LineName.SEVEN_TRAIN, ['Manhattan-bound', 'Queens-bound']],
    [LineName.A_TRAIN, ['Downtown', 'Uptown']],
    [LineName.A_ROCKAWAY_MOTT_TRAIN, ['Far Rockaway-Mott Av', 'Inwood 207-St']],
    [LineName.A_LEFFERTS_TRAIN, ['Ozone Park-Lefferts Blvd', 'Inwood 207-St']],
    [LineName.B_TRAIN, ['Brooklyn-bound', 'Manhattan-bound']],
    [LineName.C_TRAIN, ['Brooklyn-bound', 'Manhattan-bound']],
    [LineName.D_TRAIN, ['Brooklyn-bound', 'Bronx-bound']],
    [LineName.E_TRAIN, ['Downtown', 'Queens-bound']],
    [LineName.F_TRAIN, ['Brooklyn-bound', 'Queens-bound']],
    [LineName.G_TRAIN, ['Church Av-bound', 'Court Sq-bound']],
    [LineName.J_TRAIN, ['Manhattan-bound', 'Queens-bound']],
    [LineName.L_TRAIN, ['Canarsie-Rockaway Pkwy-bound', '8 Av-bound']],
    [LineName.M_TRAIN, ['Brooklyn-bound', 'Queens-bound']],
    [LineName.N_TRAIN, ['Brooklyn-bound', 'Queens-bound']],
    [LineName.Q_TRAIN, ['Brooklyn-bound', 'Manhattan-bound']],
    [LineName.R_TRAIN, ['Brooklyn-bound', 'Manhattan-bound']],
    [LineName.W_TRAIN, ['Manhattan-bound', 'Queens-bound']],
    [LineName.Z_TRAIN, ['Manhattan-bound', 'Queens-bound']],
    [LineName.S_TRAIN, ['Times Sq-bound', 'Grand Central-bound']],
    [LineName.S_TRAIN_SHUTTLE, ['Franklin Av-bound', 'Prospect Park-bound']],
    [LineName.S_TRAIN_ROCKAWAY, ['Broad Channel-bound', 'Rockaway Park-Beach-bound']],
])

const lineTypes: Map<LineName, LineType> = new Map([
    [LineName.NULL_TRAIN, LineType.NONE],
    [LineName.ONE_TRAIN, LineType.LOCAL],
    [LineName.TWO_TRAIN, LineType.EXPRESS],
    [LineName.THREE_TRAIN, LineType.EXPRESS],
    [LineName.FOUR_TRAIN, LineType.EXPRESS],
    [LineName.FIVE_TRAIN, LineType.EXPRESS],
    [LineName.SIX_TRAIN, LineType.LOCAL],
    [LineName.SEVEN_TRAIN, LineType.LOCAL],
    [LineName.A_TRAIN, LineType.EXPRESS],
    [LineName.B_TRAIN, LineType.EXPRESS],
    [LineName.C_TRAIN, LineType.LOCAL],
    [LineName.D_TRAIN, LineType.EXPRESS],
    [LineName.E_TRAIN, LineType.EXPRESS],
    [LineName.F_TRAIN, LineType.LOCAL],
    [LineName.G_TRAIN, LineType.LOCAL],
    [LineName.J_TRAIN, LineType.LOCAL],
    [LineName.L_TRAIN, LineType.LOCAL],
    [LineName.M_TRAIN, LineType.LOCAL],
    [LineName.N_TRAIN, LineType.EXPRESS],
    [LineName.Q_TRAIN, LineType.EXPRESS],
    [LineName.R_TRAIN, LineType.LOCAL],
    [LineName.W_TRAIN, LineType.LOCAL],
    [LineName.Z_TRAIN, LineType.LOCAL],
    [LineName.S_TRAIN, LineType.NONE],
    [LineName.S_TRAIN_SHUTTLE, LineType.NONE],
    [LineName.S_TRAIN_ROCKAWAY, LineType.NONE],
])

export class Train {
    private currentLine: LineName
    private lineType: LineType
    private direction: Direction
    private uptownLabel: string
    private downtownLabel: string

    private scheduledStops: Station[]
    private currentStationIndex: number = 0

    private isAtRockawayBranch: boolean = false
    private isAtEndOfLine: boolean = false

    constructor(
        currentLine: LineName = LineName.NULL_TRAIN,
        lineType: LineType = LineType.NONE,
        direction: Direction = Direction.NULL_DIRECTION,
        uptownLabel: string = 'Uptown',
        downtownLabel: string = 'Downtown',
        scheduledStops: Station[] = []
    ) {
        this.currentLine = currentLine
        this.lineType = lineType
        this.direction = direction
        this.uptownLabel = uptownLabel
        this.downtownLabel = downtownLabel
        this.scheduledStops = scheduledStops
    }

    // LineName
    public getLine(): LineName {
        return this.currentLine
    }

    public setLine(newLineName: LineName) {
        this.currentLine = newLineName
    }

    public isLineNull(): boolean {
        return this.currentLine === LineName.NULL_TRAIN
    }

    public isShuttle(): boolean {
        return this.currentLine === LineName.S_TRAIN || this.currentLine === LineName.S_TRAIN_ROCKAWAY || this.currentLine === LineName.S_TRAIN_SHUTTLE
    }

    // LineType
    public setLineType() {
        this.lineType = lineTypes.get(this.currentLine) ?? LineType.NONE
    }

    public getLineType(): LineType {
        return lineTypes.get(this.currentLine) ?? LineType.NONE
    }

    // Direction
    public getDirection(): Direction {
        return this.direction
    }

    public setDirection(newDirection: Direction) {
        this.direction = newDirection
    }

    public isNullDirection(): boolean {
        return this.direction === Direction.NULL_DIRECTION
    }

    public reverseDirection(): Train {
        this.setDirection(this.direction === Direction.DOWNTOWN ? Direction.UPTOWN : Direction.DOWNTOWN)
        return this
    }

    public getRandomDirection(): Direction {
        const directions = [Direction.UPTOWN, Direction.DOWNTOWN]
        const randomIndex = Math.floor(Math.random() * directions.length)
        return directions[randomIndex]
    }

    // Labels
    public setUptownLabel(newLabel: string) {
        this.uptownLabel = newLabel
    }

    public setDowntownLabel(newLabel: string) {
        this.downtownLabel = newLabel
    }

    public getUptownLabel(): string {
        return this.uptownLabel
    }

    public getDowntownLabel(): string {
        return this.downtownLabel
    }

    public findDirectionLabel(direction: Direction, line: LineName): string {
        const lineDirection = lineDirections.get(line)
        if (lineDirection) {
            return direction === Direction.DOWNTOWN ? lineDirection[0] : lineDirection[1]
        }
        return ''
    }

    public getDirectionLabel(): string {
        return this.findDirectionLabel(this.direction, this.currentLine)
    }

    // Scheduled Stops
    public async updateScheduledStops(line: LineName): Promise<void> {
        await updateStopsForLine(line, this.scheduledStops)
    }

    public getScheduledStops(): Station[] {
        return this.scheduledStops
    }

    public getScheduledStopsBetween(index1: number, index2: number): Station[] {
        const newScheduledStops: Station[] = []

        for (let i = index1; i <= index2; i++) {
            if (this.scheduledStops[i]) {
                // Check if the station exists
                newScheduledStops.push(this.scheduledStops[i])
            }
        }

        return newScheduledStops
    }

    public addScheduledStop(newStop: Station): void {
        this.scheduledStops.push(newStop)
    }

    public setScheduledStops(newScheduledStops: Station[]): void {
        this.scheduledStops = newScheduledStops
    }

    // Current Stations
    public getCurrentStation(): Station {
        return this.scheduledStops[this.currentStationIndex]
    }

    public getCurrentStationIndex(): number {
        return this.currentStationIndex ?? 0 // Uses 0 if `currentStationIndex` is undefined
    }

    public setCurrentStationByIndex(stationIndex: number): void {
        this.currentStationIndex = stationIndex
    }

    public isAtLastStop(): boolean {
        return this.isAtEndOfLine
    }

    public isAtRockawayBranchJunction(): boolean {
        return this.isAtRockawayBranch
    }

    public setCurrentStation(station: Station) {
        this.currentStationIndex = this.scheduledStops.findIndex((stop) => stop.getId() === station.getId())
    }

    public setCurrentStationIndexByName(stationName: string, newScheduledStops: Station[]) {
        this.currentStationIndex = newScheduledStops.findIndex((station) => station.getName() === stationName)
    }

    public static getCurrentStationIndexByName(stationName: string, scheduledStops: Station[]): number {
        return scheduledStops.findIndex((station) => station.getName() === stationName)
    }

    // Transfer Logic
    public isValidTransfer(newLine: LineName, currentStation: Station): boolean {
        const transfers = currentStation.getTransfers()

        for (const transferLine of transfers) {
            if (transferLine === newLine) {
                return true
            }
        }

        return false
    }

    public async transferToLine(newLine: LineName, currentStation: Station): Promise<boolean> {
        if (this.isValidTransfer(newLine, currentStation)) {
            await this.updateScheduledStops(newLine)
            this.setCurrentStationIndexByName(currentStation.getName(), this.scheduledStops)
            this.currentLine = newLine
            this.uptownLabel = this.findDirectionLabel(Direction.UPTOWN, newLine)
            this.downtownLabel = this.findDirectionLabel(Direction.DOWNTOWN, newLine)

            return true
        }
        return false // not a valid requested transfer
    }

    // Action Logic
    public updateTrainState(): Train {
        const lastStationIndex: number = this.scheduledStops.length - 1

        this.isAtRockawayBranch = this.getCurrentStation().getName() === 'Rockaway Blvd' && this.direction === Direction.DOWNTOWN

        // this is a mess but trust it works (I don't remember how I did this)
        this.isAtEndOfLine =
            ((this.currentStationIndex === 0 && this.direction === Direction.DOWNTOWN) ||
                (this.currentStationIndex === lastStationIndex && this.direction === Direction.UPTOWN)) &&
            !this.isAtRockawayBranch
        
        return this
    }

    public advanceStation(): Train {
        let newStationIndex = this.currentStationIndex

        if (this.direction === Direction.UPTOWN) {
            newStationIndex++
        } else if (this.direction === Direction.DOWNTOWN) {
            newStationIndex--
        } else {
            return this // Null Direction
        }

        if (newStationIndex < 0 || newStationIndex >= this.scheduledStops.length) {
            return this // Out of bounds
        }

        this.setCurrentStationByIndex(newStationIndex)
        return this
    }

    public advanceStationInc(numStations: number): Train {
        if (numStations <= 0) return this

        let newStationIndex = this.currentStationIndex

        if (this.direction === Direction.UPTOWN) {
            newStationIndex += numStations
        } else if (this.direction === Direction.DOWNTOWN) {
            newStationIndex -= numStations
        } else {
            return this // Null Direction
        }

        if (newStationIndex < 0 || newStationIndex >= this.scheduledStops.length) {
            return this // Out of bounds
        }

        this.setCurrentStationByIndex(newStationIndex)
        return this
    }
}
