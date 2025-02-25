import { LineName, LineType, Borough, Direction, lineDirectionsDetailed, lineTypes } from './EnumManager'
import { Station } from './StationManager'
import { updateStopsForLine } from './SubwayMap'



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
        return (
            this.currentLine === LineName.S_TRAIN ||
            this.currentLine === LineName.S_TRAIN_ROCKAWAY ||
            this.currentLine === LineName.S_TRAIN_SHUTTLE
        )
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

    public setDirection(newDirection: Direction): Train {
        this.direction = newDirection
        return this
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

    public findDirectionLabel(direction: Direction, line: LineName, currentBorough?: Borough): string {
        const detailedLineDirection = lineDirectionsDetailed.get(line)

        if (detailedLineDirection) {
            if (currentBorough && detailedLineDirection.boroughSpecificLabels?.[currentBorough]) {
                const boroughSpecificLabels = detailedLineDirection.boroughSpecificLabels[currentBorough]
                const boroughSpecificDirection = boroughSpecificLabels?.[direction]

                if (boroughSpecificDirection) return boroughSpecificDirection
            }
            // fallback to default directions if borough specific not found
            else if (detailedLineDirection.defaultDirectionLabels) {
                return direction === Direction.DOWNTOWN
                    ? detailedLineDirection.defaultDirectionLabels[0]
                    : detailedLineDirection.defaultDirectionLabels[1]
            }
        }

        return ''
    }

    public getDirectionLabel(): string {
        const currentBorough = this.scheduledStops[this.getCurrentStationIndex()].getBorough()
        return this.findDirectionLabel(this.direction, this.currentLine, currentBorough)
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

    public setCurrentStationIndexByID(stationID: string, newScheduledStops: Station[]) {
        this.currentStationIndex = newScheduledStops.findIndex((station) => station.getId() === stationID)
    }

    public static getCurrentStationIndexByID(stationID: string, scheduledStops: Station[]): number {
        return scheduledStops.findIndex((station) => station.getId() === stationID)
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
            this.setCurrentStationIndexByID(currentStation.getId(), this.scheduledStops)
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
