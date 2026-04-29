import { initializeSubwayData, getStationsForLine, getRandomStationFromLine, getRandomDestination } from '../subwayMap'
import { LineName, Borough } from '../LineManager'

const mockSubwayData = {
    [LineName.ONE_TRAIN]: [
        { id: '120', name: '96 St', transfers: [LineName.ONE_TRAIN, LineName.TWO_TRAIN, LineName.THREE_TRAIN], borough: Borough.MANHATTAN },
        { id: '119', name: '103 St', transfers: [LineName.ONE_TRAIN], borough: Borough.MANHATTAN },
    ],
    [LineName.TWO_TRAIN]: [
        { id: '120', name: '96 St', transfers: [LineName.ONE_TRAIN, LineName.TWO_TRAIN, LineName.THREE_TRAIN], borough: Borough.MANHATTAN },
        { id: '227', name: 'Central Park North (110 St)', transfers: [LineName.TWO_TRAIN, LineName.THREE_TRAIN], borough: Borough.BRONX },
    ],
}

describe('subwayMap', () => {
    beforeEach(async () => {
        jest.clearAllMocks()
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSubwayData),
            })
        )
        await initializeSubwayData()
    })

    test('getStationsForLine() returns the correct stations', () => {
        const stations = getStationsForLine(LineName.ONE_TRAIN)
        expect(stations.length).toBe(2)
        expect(stations[0].getName()).toBe('96 St')
        expect(stations[0].getId()).toBe('120')
    })

    test('getRandomStationFromLine() returns a station from the correct line', () => {
        const rng = () => 0
        const station = getRandomStationFromLine(LineName.TWO_TRAIN, rng)
        expect(station.getId()).toBe('120')
    })

    test('getRandomDestination() "deduplicates" transfer stations', () => {
        const rng = () => 0.99
        const station = getRandomDestination(rng)

        expect(station).toBeDefined()
        expect(['119', '120', '227']).toContain(station.getId())
    })
})
