import { LineName } from '../../logic/LineManager'
import { getCorrespondingLineGroup, getLineSVG, getLineSVGs, groupLines } from '../lineSVGsMap'

const mockLineList = [LineName.ONE_TRAIN, LineName.TWO_TRAIN, LineName.THREE_TRAIN, LineName.J_TRAIN, LineName.G_TRAIN]

const expectedLineGroups = [[LineName.ONE_TRAIN, LineName.TWO_TRAIN, LineName.THREE_TRAIN], [LineName.J_TRAIN], [LineName.G_TRAIN]]

describe('lineSVGsMap', () => {
    test('getLineSVG()', () => {
        expect(getLineSVG(LineName.ONE_TRAIN)).toBe('1.svg')
    })

    test('getLineSVGs()', () => {
        expect(getLineSVGs([LineName.NULL_TRAIN, LineName.ONE_TRAIN])).toEqual(['t.svg', '1.svg'])
    })

    test('groupLines()', () => {
        expect(groupLines(mockLineList, 'TEST_ID')).toEqual(expectedLineGroups)
    })
    test('groupLines() unique station group', () => {
        expect(groupLines(mockLineList, '4A9')).toEqual([[LineName.F_TRAIN, LineName.G_TRAIN], [LineName.R_TRAIN]])
    })
    test('groupLines() common case', () => {
        expect(groupLines([LineName.J_TRAIN, LineName.M_TRAIN, LineName.Z_TRAIN], 'TEST_ID')).toEqual([
            [LineName.J_TRAIN, LineName.M_TRAIN, LineName.Z_TRAIN],
        ])
    })

    test('getCorrespondingLineGroup()', () => {
        expect(getCorrespondingLineGroup(LineName.THREE_TRAIN, expectedLineGroups)).toEqual([
            LineName.ONE_TRAIN,
            LineName.TWO_TRAIN,
            LineName.THREE_TRAIN,
        ])
    })
})
