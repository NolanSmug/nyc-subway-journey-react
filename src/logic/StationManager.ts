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
            // console.log('All NYC stations already initialized.')
            return
        }

        this.allNycStations = await SubwayMap.getAllLineStations(LineName.NULL_TRAIN)
        console.log('All NYC stations initialized')
    }

    static getRandomStation(stations: Station[], rng: () => number = Math.random): Station {
        if (stations.length === 0) {
            throw new Error('Station vector is empty')
        }
        const randomIndex = Math.floor(rng() * stations.length)

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

    // NOTE: We put this here because some team members have a hard time using the not
    // operator correctly. Please create similar functions in all relevant places in
    // the code, thank you. -HR
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
            // throw new Error('station id not found in data files, please contact developer')
            throw new Error("The fuckin, thing isn't where the thing should be, please go fuck yourself")
        }
        return this.id
    }

    public setId(newId: string): void {
        this.id = newId
    }

    // TODO(eric): Please fucking stop doing this shit. What is the point of this. It's 
    // just wasted life energy
    //
    // station.name = "foo"
    // let foo = station.name
    //
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
