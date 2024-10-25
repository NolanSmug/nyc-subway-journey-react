import { LineName } from './Line'
import { SubwayMap } from './SubwayMap'

export enum Borough {
    MANHATTAN = 'Manhattan',
    BROOKLYN = 'Brooklyn',
    QUEENS = 'Queens',
    BRONX = 'Bronx',
    STATEN_ISLAND = 'Staten Island',
}

export class Station {
    private id: string = "000"
    private name: string = "NULL_STATION"
    private transfers: LineName[] = [LineName.NULL_TRAIN]
    private borough: Borough = Borough.STATEN_ISLAND

    static allNycStations: Station[] = []
    static async initializeAllStations(): Promise<void> {
        if (this.allNycStations.length === 0) {
            await SubwayMap.createStations(LineName.NULL_TRAIN, this.allNycStations)
            console.log('All NYC stations initialized:', this.allNycStations)
        } else {
            console.log('All NYC stations already initialized.')
        }
    }

    static NULL_STATION: Station = new Station("000", "NULL_STATION", [LineName.NULL_TRAIN], Borough.STATEN_ISLAND)

    constructor(id: string, name: string, transfers: LineName[], borough: Borough) {
        this.id = id
        this.name = name
        this.transfers = transfers
        this.borough = borough
    }

    // Operators
    public equals(rhs: Station): boolean {
        return this.name === rhs.name && this.transfersEqual(rhs.transfers)
    }

    public notEquals(rhs: Station): boolean {
        return !this.equals(rhs)
    }

    private transfersEqual(transfers: string[]): boolean {
        if (this.transfers.length !== transfers.length) return false
        return this.transfers.every((transfer, index) => transfer === transfers[index])
    }

    // ID
    public getId(): string {
        return this.id
    }

    public setId(newId: string): void {
        this.id = newId
    }

    // Name
    public getName(): string {
        return this.name
    }

    public setName(newName: string): void {
        this.name = newName
    }

    // Borough
    public getBorough(): Borough {
        return this.borough
    }

    public setBorough(newBorough: Borough): void {
        this.borough = newBorough
    }

    // Transfers
    public getTransfers(): LineName[] {
        return this.transfers
    }

    public hasTransferLine(requestedLine?: LineName): boolean {
        if (requestedLine) {
            // Check if the requested line exists in transfers
            for (const line of this.transfers) {
                if (line === requestedLine) {
                    return true
                }
            }
            return false
        } else {
            // No argument provided, check if more than one transfer exists
            return this.transfers.length > 1
        }
    }

    public getStationByID(stationID: string) {
        for (const station of Station.allNycStations) {
            if (station.id === stationID) {
                return station
            }
        }

        return new Station('000', 'NULL_STATION', [LineName.NULL_TRAIN], Borough.MANHATTAN)
    }

    static getRandomStation(stations: Station[]): Station {
        if (stations.length === 0) {
            throw new Error('Station vector is empty')
        }
        const randomIndex = Math.floor(Math.random() * stations.length)

        return stations[randomIndex]
    }
}
