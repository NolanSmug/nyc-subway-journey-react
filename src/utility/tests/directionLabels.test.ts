import { Borough, Direction, LineName } from '../../logic/LineManager'
import { findDirectionLabel } from '../directionLabels'

describe('directionLabels', () => {
    test('findDirectionLabel() on line with default labels', () => {
        expect(findDirectionLabel(LineName.ONE_TRAIN, Direction.DOWNTOWN, Borough.BRONX)).toBe('Downtown')
    })

    test('findDirectionLabel() on line with 2 borough specific labels', () => {
        expect(findDirectionLabel(LineName.THREE_TRAIN, Direction.DOWNTOWN, Borough.MANHATTAN)).toBe('Brooklyn-bound')
        expect(findDirectionLabel(LineName.THREE_TRAIN, Direction.DOWNTOWN, Borough.BROOKLYN)).toBe('New Lots Avenue-bound')
    })

    test('findDirectionLabel() on line with 3 borough specific labels', () => {
        expect(findDirectionLabel(LineName.B_TRAIN, Direction.UPTOWN, Borough.BRONX)).toBe('Bedford Park Blvd-bound')
        expect(findDirectionLabel(LineName.B_TRAIN, Direction.UPTOWN, Borough.MANHATTAN)).toBe('Uptown')
        expect(findDirectionLabel(LineName.B_TRAIN, Direction.DOWNTOWN, Borough.BROOKLYN)).toBe('Brighton Beach-bound')
    })

    test('findDirectionLabel() returns empty string for invalid line', () => {
        expect(findDirectionLabel(LineName.NULL_TRAIN, Direction.UPTOWN, Borough.BRONX)).toBe('')
    })

    test('findDirectionLabel() returns empty string for invalid direction', () => {
        expect(findDirectionLabel(LineName.ONE_TRAIN, Direction.NULL_DIRECTION, Borough.BRONX)).toBe('')
    })

    test('findDirectionLabel() returns empty string for invalid line-borough combination', () => {
        expect(findDirectionLabel(LineName.SIX_TRAIN, Direction.UPTOWN, Borough.BROOKLYN)).toBe('')
    })
})
