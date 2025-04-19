import { LineName, Borough } from './EnumManager'
import { Station } from './StationManager'

// It looks like you're using Singleton pattern here?
// But if this was singleton, why is there no shared state?
//
// This looks like a place where having global state would simplify things?
//
export class SubwayMap {
    static getCsvFromLineName(line: LineName) {
        if (line === LineName.NULL_TRAIN) {
            return '/csv/all_stations.csv'
        }
        if (line === LineName.A_ROCKAWAY_MOTT_TRAIN) {
            return '/csv/a_train_rockaway-mott_stations.csv'
        }
        if (line === LineName.A_LEFFERTS_TRAIN) {
            return '/csv/a_train_lefferts_stations.csv'
        }

        const filePath: string = `/csv/${line.toLowerCase()}_stations.csv`

        console.log(filePath)
        return filePath
    }

    static async createStations(line: LineName, subwayStations: Station[]) {
        const filePath = this.getCsvFromLineName(line)

        const response = await fetch(filePath)
        if (!response.ok) {
            throw new Error(`Failed to load CSV file for line: ${line}`)
        }

        const csv = await response.text()
        const lines = csv.split('\n')

        lines.shift() // Remove header
        subwayStations.length = 0 // Clear the array

        lines.forEach((line, index) => {
            const columns = line.split(',')
            if (columns.length < 4) {
                console.error(`Invalid row at index ${index}: ${line}`)
                return // Skip invalid rows
            }

            const [id, name, transfersString, boroughString] = columns

            if (!transfersString || !boroughString) {
                console.error(`Missing data at index ${index}: ${line}`)
                return
            }

            const transfers = transfersString.trim().split(' ').map(mapTransferString)
            const borough = boroughStringToEnum(boroughString.trim())
            const station = new Station(id.trim(), name.trim(), transfers, borough)

            subwayStations.push(station)
        })
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
            // Yeah!
            throw new Error('Unknown borough')
    }
}

function mapTransferString(transfer: string): LineName {
    switch (transfer) {
        case '1':
            return LineName.ONE_TRAIN
        case '2':
            return LineName.TWO_TRAIN
        case '3':
            return LineName.THREE_TRAIN
        case '4':
            return LineName.FOUR_TRAIN
        case '5':
            return LineName.FIVE_TRAIN
        case '6':
            return LineName.SIX_TRAIN
        case '7':
            return LineName.SEVEN_TRAIN
        case 'A':
            return LineName.A_TRAIN
        case 'B':
            return LineName.B_TRAIN
        case 'C':
            return LineName.C_TRAIN
        case 'D':
            return LineName.D_TRAIN
        case 'E':
            return LineName.E_TRAIN
        case 'F':
            return LineName.F_TRAIN
        case 'M':
            return LineName.M_TRAIN
        case 'N':
            return LineName.N_TRAIN
        case 'Q':
            return LineName.Q_TRAIN
        case 'R':
            return LineName.R_TRAIN
        case 'W':
            return LineName.W_TRAIN
        case 'J':
            return LineName.J_TRAIN
        case 'Z':
            return LineName.Z_TRAIN
        case 'G':
            return LineName.G_TRAIN
        case 'L':
            return LineName.L_TRAIN
        case 'S':
            return LineName.S_TRAIN
        case 'Sf':
            return LineName.S_TRAIN_SHUTTLE
        case 'Sr':
            return LineName.S_TRAIN_ROCKAWAY
        default:
            throw new Error("Fuck you buddy")
            return LineName.NULL_TRAIN // if the transfer is unrecognized
    }
}

export async function updateStopsForLine(line: LineName, subwayStations: Station[]): Promise<void> {
    await SubwayMap.createStations(line, subwayStations)
}
