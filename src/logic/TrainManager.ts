import { LineName, LineType } from './Line'
import { Station } from './StationManager'
import { SubwayMap, updateStopsForLine } from './SubwayMap'

enum Direction {
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
    [LineName.S_TRAIN_ROCKAWAY, ['Broad Channel-bound', 'Rockaway Park-Beach 116 St-bound']],
])

const lineTypes: Map<LineName, LineType> = new Map([
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
        currentLine: LineName,
        lineType: LineType,
        direction: Direction,
        uptownLabel: string,
        downtownLabel: string,
        scheduledStops: Station[]
    ) {
        this.currentLine = currentLine
        this.lineType = lineType
        this.direction = direction
        this.uptownLabel = uptownLabel
        this.downtownLabel = downtownLabel
        this.scheduledStops = scheduledStops
    }

    // LineName
    public getLineName(): LineName {
        return this.currentLine
    }

    public setLineName(newLineName: LineName) {
        this.currentLine = newLineName
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

    public reverseDirection() {
        this.direction = this.direction == Direction.DOWNTOWN ? Direction.UPTOWN : Direction.DOWNTOWN
    }

    // Labels
    public setUptownLabel(newLabel: string) {
        this.uptownLabel = newLabel
    }

    public setDowntownLabel(newLabel: string) {
        this.downtownLabel = newLabel
    }

    public getDirectionLabel(direction: Direction, line: LineName): string {
        const lineDirection = lineDirections.get(line)
        if (lineDirection) {
            return direction === Direction.DOWNTOWN ? lineDirection[0] : lineDirection[1]
        }
        return ''
    }

    // Scheduled Stops
    public updateScheduledStops(line: LineName) {
        updateStopsForLine(line, this.scheduledStops)
    }

    public getScheduledStops(): Station[] {
        return this.scheduledStops
    }

    public addScheduledStop(newStop: Station) {
        this.scheduledStops.push(newStop)
    }

    public setScheduledStops(newScheduledStops: Station[]) {
        this.scheduledStops = newScheduledStops
    }

    // Current Stations
    public getCurrentStation(): Station {
        return this.scheduledStops[this.currentStationIndex]
    }

    public getCurrentStationIndex(): number {
        return this.currentStationIndex
    }

    public setCurrentStationByIndex(stationIndex: number) {
        this.currentStationIndex = stationIndex
    }

    public isAtLastStop(): boolean {
        return this.isAtEndOfLine
    }

    public isAtRockawayBranchJunction() {
        return this.isAtRockawayBranch
    }

    public setCurrentStation(station: Station) {
        const reversedScheduledStops = [...this.scheduledStops].reverse()

        for (let i = 0; i < reversedScheduledStops.length; i++) {
            if (reversedScheduledStops[i].getId() == station.getId()) {
                this.currentStationIndex = this.scheduledStops.length - i - 1
                break
            }
        }
    }

    public setCurrentStationByName(stationName: string) {
        for (let i = 0; i < this.scheduledStops.length; i++) {
            if (this.scheduledStops[i].getName() === stationName) {
                this.currentStationIndex = i
                break
            }
        }
    }

    // Transfer Logic
    public isValidTransfer(newLine: LineName, currentStation: Station): boolean {
        const transfers = currentStation.getTransfers()

        for (const transferLine of transfers) {
            if (transferLine == newLine) {
                return true
            }
        }

        return false
    }

    public transferToLine(newLine: LineName, currentStation: Station): boolean {
        if (this.isValidTransfer(newLine, currentStation)) {
            this.updateScheduledStops(newLine)
            this.setCurrentStationByName(currentStation.getName())
            this.currentLine = newLine
            this.uptownLabel = this.getDirectionLabel(Direction.UPTOWN, newLine)
            this.downtownLabel = this.getDirectionLabel(Direction.DOWNTOWN, newLine)

            return true
        }
        return false // not a valid requested transfer
    }

    // Action Logic
    public updateTrainState() {
        const lastStationIndex: number = this.scheduledStops.length - 1

        this.isAtRockawayBranch =
            this.getCurrentStation().getName() == 'Rockaway Blvd' && this.direction == Direction.DOWNTOWN

        // this is a mess but trust it works (I don't remember how I did this)
        this.isAtEndOfLine =
            ((this.currentStationIndex === 0 && this.direction === Direction.DOWNTOWN) ||
                (this.currentStationIndex === lastStationIndex && this.direction === Direction.UPTOWN)) &&
            !this.isAtRockawayBranch
    }

    public advanceStation(): boolean {
        let newStationIndex = this.currentStationIndex

        if (this.direction == Direction.UPTOWN) {
            newStationIndex++
        } else if (this.direction == Direction.DOWNTOWN) {
            newStationIndex--
        } else {
            return false
        }

        if (newStationIndex < 0 || newStationIndex >= this.scheduledStops.length) {
            return false // Out of bounds
        }

        this.setCurrentStationByIndex(newStationIndex)
        return true
    }

    public advanceStationInc(numStations: number): boolean {
        if (numStations <= 0) return false

        let newStationIndex = this.currentStationIndex

        if (this.direction == Direction.UPTOWN) {
            newStationIndex += numStations
        } else if (this.direction == Direction.DOWNTOWN) {
            newStationIndex -= numStations
        } else {
            return false
        }

        if (newStationIndex < 0 || newStationIndex >= this.scheduledStops.length) {
            return false // Out of bounds
        }

        this.setCurrentStationByIndex(newStationIndex)
        return true
    }
}
