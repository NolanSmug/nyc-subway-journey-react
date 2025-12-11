import { LineName, LineType, Borough, Direction, LINE_DIRECTION_LABELS, getLineType } from './LineManager'
import { Station } from './StationManager'
import { getStationsForLine } from './SubwayMap'

export class Train {
    private currentLine: LineName
    private direction: Direction
    private uptownLabel: string
    private downtownLabel: string

    private scheduledStops: Station[]
    private currentStationIndex: number = 0

    constructor(
        currentLine: LineName = LineName.NULL_TRAIN,
        direction: Direction = Direction.NULL_DIRECTION,
        uptownLabel: string = 'Uptown',
        downtownLabel: string = 'Downtown',
        scheduledStops: Station[] = []
    ) {
        this.currentLine = currentLine
        this.direction = direction
        this.uptownLabel = uptownLabel
        this.downtownLabel = downtownLabel
        this.scheduledStops = scheduledStops
    }

    public clone(): Train {
        const newTrain = new Train()

        Object.assign(newTrain, this)

        return newTrain
    }

    // LineName
    public getLine(): LineName {
        return this.currentLine
    }

    public setLine(newLineName: LineName): void {
        this.currentLine = newLineName
        this.repOk()
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
    public getLineType(): LineType {
        return getLineType(this.currentLine)
    }

    // Direction
    public getDirection(): Direction {
        return this.direction
    }

    public setDirection(newDirection: Direction): Train {
        this.direction = newDirection
        this.repOk()
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
        const detailedLineDirection = LINE_DIRECTION_LABELS.get(line)

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
        return this.currentStationIndex
    }

    public setCurrentStationByIndex(stationIndex: number): void {
        this.currentStationIndex = stationIndex
    }

    public setCurrentStation(station: Station) {
        const index: number = this.scheduledStops.findIndex((stop) => stop.getId() === station.getId())

        this.currentStationIndex = index
        this.repOk()
    }

    public setCurrentStationIndexByID(stationID: string, newScheduledStops: Station[]) {
        this.currentStationIndex = newScheduledStops.findIndex((station) => station.getId() === stationID)
        this.repOk()
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
            this.setScheduledStops(await getStationsForLine(newLine))
            this.setCurrentStationIndexByID(currentStation.getId(), this.scheduledStops)
            this.currentLine = newLine
            this.uptownLabel = this.findDirectionLabel(Direction.UPTOWN, newLine)
            this.downtownLabel = this.findDirectionLabel(Direction.DOWNTOWN, newLine)

            this.repOk()
            return true
        }

        return false // not a valid requested transfer
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
        this.repOk()

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

        this.repOk()
        this.setCurrentStationByIndex(newStationIndex)

        return this
    }

    private repOk(): void {
        function assert(exp: boolean, msg?: string): void {
            if (!exp) {
                throw new Error(msg)
            }
        }

        // sometimes we want the train line to be null (examples below), so assert less conditions
        if (this.isLineNull()) {
            assert(this.direction === Direction.NULL_DIRECTION, 'A null train must be in NULL_DIRECTION')
        } else {
            assert(this.scheduledStops.length > 0, 'Active train must have scheduled stops')
            assert(
                this.currentStationIndex >= 0 && this.currentStationIndex < this.scheduledStops.length,
                `currentStationIndex (${this.currentStationIndex} is out of bounds for scheduledStops of length ${this.scheduledStops.length})`
            )
        }
        // When we like NULL_TRAIN
        //  - SubwayMap will load all_stations if isLineNull()
        //  - The OptimalRoute UI AND API. The entire API backend will break if it can't utilize NULL_TRAIN
        //
    }
}
