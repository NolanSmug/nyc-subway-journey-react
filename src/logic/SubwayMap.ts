import { LineName, Borough } from './LineManager'
import { Station } from './StationManager'

export class SubwayMap {
    private static cache: Map<LineName, Station[]> = new Map()

    static getCsvFromLineName(line: LineName) {
        if (line === LineName.NULL_TRAIN) return '/csv/all_stations.csv'
        if (line === LineName.A_ROCKAWAY_MOTT_TRAIN) return '/csv/a_train_rockaway-mott_stations.csv'
        if (line === LineName.A_LEFFERTS_TRAIN) return '/csv/a_train_lefferts_stations.csv'

        return `/csv/${line.toLowerCase()}_stations.csv`
    }

    static async getAllLineStations(line: LineName): Promise<Station[]> {
        if (this.cache.has(line)) {
            return this.cache.get(line)!
        }

        const filePath = this.getCsvFromLineName(line)
        const response = await fetch(filePath)

        if (!response.ok) {
            throw new Error(`Failed to load CSV file for line: ${line}`)
        }

        const csv: string = await response.text()
        const rows = csv.split('\n')
        const subwayStations: Station[] = []

        rows.shift()

        rows.forEach((row, index) => {
            const columns: string[] = row.split(',')
            if (columns.length < 4) {
                console.error(`Invalid row at index ${index}: ${row}`)
                return
            }

            const [id, name, transfersString, boroughString] = columns

            const transfers: LineName[] = transfersString.trim().split(' ').map(mapTransferString) // "B Q" -> [B_Train, Q_Train]
            const borough: Borough = boroughStringToEnum(boroughString.trim())
            const station: Station = new Station(id.trim(), name.trim(), transfers, borough)

            subwayStations.push(station)
        })

        this.cache.set(line, subwayStations)
        return [...subwayStations]
    }
}

function boroughStringToEnum(borough: string): Borough {
    switch (borough.toLowerCase()) {
        case 'bk':
            return Borough.BROOKLYN
        case 'm':
            return Borough.MANHATTAN
        case 'q':
            return Borough.QUEENS
        case 'bx':
            return Borough.BRONX
        case 'si':
            return Borough.STATEN_ISLAND
        default:
            throw new Error('Unknown borough')
    }
}

function mapTransferString(transfer: string): LineName {
    const stringToLine: Record<string, LineName> = {
        '1': LineName.ONE_TRAIN,
        '2': LineName.TWO_TRAIN,
        '3': LineName.THREE_TRAIN,
        '4': LineName.FOUR_TRAIN,
        '5': LineName.FIVE_TRAIN,
        '6': LineName.SIX_TRAIN,
        '7': LineName.SEVEN_TRAIN,
        A: LineName.A_TRAIN,
        Al: LineName.A_LEFFERTS_TRAIN,
        Ar: LineName.A_ROCKAWAY_MOTT_TRAIN,
        B: LineName.B_TRAIN,
        C: LineName.C_TRAIN,
        D: LineName.D_TRAIN,
        E: LineName.E_TRAIN,
        F: LineName.F_TRAIN,
        M: LineName.M_TRAIN,
        N: LineName.N_TRAIN,
        Q: LineName.Q_TRAIN,
        R: LineName.R_TRAIN,
        W: LineName.W_TRAIN,
        J: LineName.J_TRAIN,
        Z: LineName.Z_TRAIN,
        G: LineName.G_TRAIN,
        L: LineName.L_TRAIN,
        S: LineName.S_TRAIN,
        Sf: LineName.S_TRAIN_SHUTTLE,
        Sr: LineName.S_TRAIN_ROCKAWAY,
    }

    return stringToLine[transfer] || LineName.NULL_TRAIN
}

export async function getStationsForLine(line: LineName): Promise<Station[]> {
    return Promise.resolve(SubwayMap.getAllLineStations(line))
}
