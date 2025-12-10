import { Train } from './TrainManager'
import { Station } from './StationManager'
import { Borough, Direction, LineName } from './LineManager'

const testStations = [
    new Station('R27', 'South Ferry', [LineName.ONE_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN], Borough.MANHATTAN),
    new Station('139', 'Rector St', [LineName.ONE_TRAIN], Borough.MANHATTAN),
    new Station('138', 'WTC Cortlandt', [LineName.ONE_TRAIN], Borough.MANHATTAN),
]

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

describe('Train actions (ONE_TRAIN)', () => {
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

    test('advanceStationInc', () => {
        train.advanceStationInc(2)
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
})
