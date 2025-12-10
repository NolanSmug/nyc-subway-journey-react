import { SubwayMap } from './SubwayMap'
import { LineName } from './LineManager'

describe('SubwayMap', () => {
    beforeEach(() => {
        // mock getAllLineStations()
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: async () =>
                `stop_id,stop_name,transfers,borough
                101,Test Station,1 2 3,M
                102,Second Station,A C E,Bk`,
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('Parses CSV (mocked getAllLineStations call)', async () => {
        const stations = await SubwayMap.getAllLineStations(LineName.ONE_TRAIN)

        expect(stations.length).toBe(2)
        expect(stations[0].getName()).toBe('Test Station')
        expect(stations[0].getBorough()).toBe('Manhattan')
    })
})
