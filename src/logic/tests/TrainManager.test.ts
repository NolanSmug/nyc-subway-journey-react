import { Train } from '../TrainManager'
import { Station } from '../StationManager'
import { Borough, Direction, LineName } from '../LineManager'
import { findDirectionLabel } from '../directionLabels'
import { initializeSubwayData } from '../subwayMap'

const testStations = [
    new Station('R27', 'South Ferry', [LineName.ONE_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN], Borough.MANHATTAN),
    new Station('139', 'Rector St', [LineName.ONE_TRAIN], Borough.MANHATTAN),
    new Station('138', 'WTC Cortlandt', [LineName.ONE_TRAIN], Borough.MANHATTAN),
]

const mockSubwayData = {
    [LineName.ONE_TRAIN]: [
        { id: 'R27', name: 'South Ferry', transfers: [LineName.ONE_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN], borough: Borough.MANHATTAN },
        { id: '139', name: 'Rector St', transfers: [LineName.ONE_TRAIN], borough: Borough.MANHATTAN },
        { id: '138', name: 'WTC Cortlandt', transfers: [LineName.ONE_TRAIN], borough: Borough.MANHATTAN },
    ],
    [LineName.R_TRAIN]: [
        {
            id: 'R27',
            name: 'Whitehall St-South Ferry',
            transfers: [LineName.ONE_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN],
            borough: Borough.MANHATTAN,
        },
    ],
}

// const testStations_R = [
//     new Station('R27', 'Whitehall St', [LineName.ONE_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN], Borough.MANHATTAN),
//     new Station('R26', 'Rector St', [LineName.R_TRAIN], Borough.MANHATTAN),
//     new Station(
//         'WTC',
//         'Cortlandt St',
//         [
//             LineName.TWO_TRAIN,
//             LineName.THREE_TRAIN,
//             LineName.A_TRAIN,
//             LineName.C_TRAIN,
//             LineName.E_TRAIN,
//             LineName.R_TRAIN,
//             LineName.W_TRAIN,
//         ],
//         Borough.MANHATTAN
//     ),
// ]

describe('Train object mutable actions', () => {
    let train: Train

    beforeEach(() => {
        train = new Train()
        train.setScheduledStops(testStations)
        train.setLine(LineName.ONE_TRAIN)

        train.setCurrentStationByIndex(0)
        train.setDirection(Direction.UPTOWN)
    })

    test('advanceStation', () => {
        train.advanceStation()
        expect(train.getCurrentStation().getName()).toBe('Rector St')

        train.advanceStation()
        expect(train.getCurrentStation().getName()).toBe('WTC Cortlandt')
    })

    test('advanceStation multiple', () => {
        train.advanceStation(2)
        expect(train.getCurrentStation().getName()).toBe('WTC Cortlandt')
    })

    test('reverseDirection, setDirection', () => {
        train.setCurrentStationByIndex(2) // WTC

        train.reverseDirection()
        expect(train.getDirection()).toBe(Direction.DOWNTOWN)

        train.reverseDirection()
        expect(train.getDirection()).toBe(Direction.UPTOWN)

        train.setDirection(Direction.NULL_DIRECTION)
        train.advanceStation()
        expect(train.getCurrentStation().getName()).toBe('WTC Cortlandt')

        train.setDirection(Direction.DOWNTOWN)
        train.advanceStation()
        expect(train.getCurrentStation().getName()).toBe('Rector St')
    })

    test('isValidTransfer', () => {
        expect(train.isValidTransfer(LineName.R_TRAIN, train.getCurrentStation())).toBe(true)
        expect(train.isValidTransfer(LineName.TWO_TRAIN, train.getCurrentStation())).toBe(false)

        train.advanceStation()
        expect(train.isValidTransfer(LineName.R_TRAIN, train.getCurrentStation())).toBe(false)
    })

    test('advanceStation overflow', () => {
        train.setCurrentStationByIndex(2) // WTC
        train.advanceStation()
        train.advanceStation(2)

        expect(train.getCurrentStation().getName()).toBe('WTC Cortlandt')
    })

    test('transfer', async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSubwayData),
            })
        )
        await initializeSubwayData()

        train.transferToLine(LineName.R_TRAIN, train.getCurrentStation())
        expect(train.getLine()).toBe(LineName.R_TRAIN)
        expect(train.getCurrentStation().getName()).toBe('Whitehall St-South Ferry')
    })

    test('directionLabel', () => {
        expect(findDirectionLabel(train.getDirection(), train.getLine(), train.getCurrentStation().getBorough())).toBe('Uptown')

        train.reverseDirection()
        expect(findDirectionLabel(train.getDirection(), train.getLine(), train.getCurrentStation().getBorough())).toBe('Downtown')
    })
})
