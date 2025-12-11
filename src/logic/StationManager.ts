import { LineName, Borough } from './LineManager'
import { SubwayMap } from './SubwayMap'

export class Station {
    private id: string
    private name: string
    private transfers: LineName[]
    private borough: Borough

    static allNycStations: Station[] = []
    static async initializeAllStations(): Promise<void> {
        if (this.allNycStations.length > 0) {
            console.log('All NYC stations already initialized.')
            return
        }

        this.allNycStations = await SubwayMap.getAllLineStations(LineName.NULL_TRAIN)
        console.log('All NYC stations initialized:', this.allNycStations)
    }

    static getRandomStation(stations: Station[]): Station {
        if (stations.length === 0) {
            throw new Error('Station vector is empty')
        }
        const randomIndex = Math.floor(Math.random() * stations.length)

        return stations[randomIndex]
    }

    static NULL_STATION: Station = new Station('000', '', [LineName.NULL_TRAIN], Borough.STATEN_ISLAND)

    constructor(id: string, name: string, transfers: LineName[], borough: Borough) {
        this.id = id
        this.name = name
        this.transfers = transfers
        this.borough = borough
    }

    // Operators
    public equals(rhs: Station): boolean {
        return this.id === rhs.id && this.transfersEqual(rhs.transfers)
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
        if (this.id === '000' || this.id === '' || this.id === null || this.id === undefined) {
            throw new Error('station id not found in data files, please contact developer')
        }
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

    public static getStationByID(stationID: string) {
        for (const station of Station.allNycStations) {
            if (station.id === stationID) {
                return station
            }
        }

        return this.NULL_STATION
    }
}
