import { LineName, LineType, Direction, getLineType } from './LineManager'
import { Station } from './Station'
import { getStationsForLine } from '../utility/subwayMap'

export class Train {
    private currentLine: LineName
    private direction: Direction
    private currentStationIndex: number = 0
    private scheduledStops: Station[]

    constructor(
        currentLine: LineName = LineName.NULL_TRAIN,
        direction: Direction = Direction.NULL_DIRECTION,
        scheduledStops: Station[] = []
    ) {
        this.currentLine = currentLine
        this.direction = direction
        this.scheduledStops = scheduledStops
    }

    // Ok I know I hate this and its ugly
    // I originally wrote all the logic in C++, and what do you know OOP is not meant for React JSX
    // TODO (tentative)
    public clone(): Train {
        const newTrain = new Train()

        Object.assign(newTrain, this)

        return newTrain
    }

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

    public getLineType(): LineType {
        return getLineType(this.currentLine)
    }

    public getDirection(): Direction {
        return this.direction
    }

    public setDirection(newDirection: Direction): void {
        this.direction = newDirection
        this.repOk()
    }

    public isNullDirection(): boolean {
        return this.direction === Direction.NULL_DIRECTION
    }

    public reverseDirection(): void {
        this.setDirection(this.direction === Direction.DOWNTOWN ? Direction.UPTOWN : Direction.DOWNTOWN)
    }

    public getRandomDirection(): Direction {
        const directions = [Direction.UPTOWN, Direction.DOWNTOWN]
        const randomIndex = Math.floor(Math.random() * directions.length)
        return directions[randomIndex]
    }

    public getScheduledStops(): Station[] {
        return this.scheduledStops
    }

    // public getScheduledStopsBetween(index1: number, index2: number): Station[] {
    //     const newScheduledStops: Station[] = []

    //     for (let i = index1; i <= index2; i++) {
    //         if (this.scheduledStops[i]) {
    //             // Check if the station exists
    //             newScheduledStops.push(this.scheduledStops[i])
    //         }
    //     }

    //     return newScheduledStops
    // }

    public addScheduledStop(newStop: Station): void {
        this.scheduledStops.push(newStop)
    }

    public setScheduledStops(newScheduledStops: Station[]): void {
        this.scheduledStops = newScheduledStops
    }

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

    // For testing ONLY
    public static getCurrentStationIndexByID(stationID: string, scheduledStops: Station[]): number {
        return scheduledStops.findIndex((station) => station.getId() === stationID)
    }

    public isValidTransfer(newLine: LineName, currentStation: Station): boolean {
        return currentStation.getTransfers().includes(newLine)
    }

    public transferToLine(newLine: LineName, currentStation: Station): boolean {
        if (this.currentLine === newLine) this.setDirection(Direction.NULL_DIRECTION)

        if (this.isValidTransfer(newLine, currentStation)) {
            const newStops: Station[] = getStationsForLine(newLine)
            const newIndex: number = newStops.findIndex((s) => s.getId() === currentStation.getId())

            if (newIndex === -1) return false

            this.setScheduledStops(newStops)
            this.setCurrentStationByIndex(newIndex)
            this.currentLine = newLine

            this.repOk()

            return true
        }

        return false // not a valid requested transfer
    }

    public advanceStation(numStations: number = 1): boolean {
        let newStationIndex = this.currentStationIndex

        if (this.direction === Direction.UPTOWN) {
            newStationIndex += numStations
        } else if (this.direction === Direction.DOWNTOWN) {
            newStationIndex -= numStations
        } else {
            return false // Null Direction
        }

        if (newStationIndex < 0 || newStationIndex >= this.scheduledStops.length) {
            return false // Out of bounds
        }

        this.setCurrentStationByIndex(newStationIndex)
        this.repOk()

        return true
    }

    // C++ stuff I wanted to keep
    private repOk(): void {
        function assert(exp: boolean, msg?: string): void {
            if (!exp) throw new Error(msg)
        }

        // Sometimes we want the train line to be null (examples below), so assert less conditions
        // When we like NULL_TRAIN
        // - SubwayMap will load all_stations if isLineNull()
        // - PassengerState depends on it
        // - OptimalRoute UI and API
        if (this.isLineNull()) {
            assert(this.direction === Direction.NULL_DIRECTION, 'A null train must be in NULL_DIRECTION')
        } else {
            assert(this.scheduledStops.length > 0, 'Active train must have scheduled stops')
            assert(
                this.currentStationIndex >= 0 && this.currentStationIndex < this.scheduledStops.length,
                `currentStationIndex (${this.currentStationIndex} is out of bounds for scheduledStops of length ${this.scheduledStops.length})`
            )
        }
    }
}
