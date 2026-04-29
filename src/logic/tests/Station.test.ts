import { Borough, LineName } from '../LineManager'
import { Station } from '../StationManager'

const testStations = [
    new Station('R27', 'South Ferry', [LineName.ONE_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN], Borough.MANHATTAN),
    new Station('R27', 'Whitehall St-South Ferry', [LineName.ONE_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN], Borough.MANHATTAN),
    new Station('139', 'Rector St', [LineName.ONE_TRAIN], Borough.MANHATTAN),
    new Station('138', 'WTC Cortlandt', [LineName.ONE_TRAIN], Borough.MANHATTAN),
]

describe('Station object', () => {
    const southFerry = testStations[0]
    const rectorSt = testStations[1]
    const wtc = testStations[2]

    test('equals', () => {
        expect(southFerry.equals(rectorSt)).toBe(true)
        expect(southFerry.equals(wtc)).toBe(false)
        expect(southFerry.equals(southFerry)).toBe(true)
    })

    test('equals different transfer order', () => {
        const diffOrderSouthFerry = new Station(
            'R27',
            'South Ferry',
            [LineName.R_TRAIN, LineName.ONE_TRAIN, LineName.W_TRAIN],
            Borough.MANHATTAN
        )

        expect(southFerry.equals(diffOrderSouthFerry)).toBe(true)
    })
})
