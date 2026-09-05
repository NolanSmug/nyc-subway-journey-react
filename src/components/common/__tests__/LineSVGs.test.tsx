import { render, screen, fireEvent } from '@testing-library/react'
import LineSVGs from '../LineSVGs'
import { LineName } from '../../../logic/LineManager'
import { getLineSVGs } from '../../../utility/lineSVGsMap'

jest.mock('../../../contexts/UIContext', () => ({
    useUIContext: (selector: any) => selector({ isTransferMode: true }),
}))

describe('LineSVGs', () => {
    const MOCK_LINES: LineName[] = [LineName.J_TRAIN, LineName.M_TRAIN, LineName.Z_TRAIN]

    test('renders the correct number of line icons', () => {
        render(<LineSVGs lines={MOCK_LINES} />)

        const images = screen.getAllByRole('img')
        expect(images).toHaveLength(3)
        expect(images[0]).toHaveAttribute('src', getLineSVGs(MOCK_LINES))
    })

    test('applies "jiggle-animation" when isTransferMode', () => {
        const handleSelect = jest.fn()

        render(<LineSVGs lines={[MOCK_LINES[0]]} onTransferSelect={handleSelect} />)

        const img = screen.getByRole('img')
        expect(img).toHaveClass('jiggle-animation')
    })

    test('handles clicking a specific line', () => {
        const handleSelect = jest.fn()

        render(<LineSVGs lines={MOCK_LINES} onTransferSelect={handleSelect} />)

        const images = screen.getAllByRole('img')
        fireEvent.pointerDown(images[1])

        expect(handleSelect).toHaveBeenCalledWith(1)
    })

    test('applies wrapper classes (small, wide, grouped)', () => {
        const { container } = render(<LineSVGs lines={MOCK_LINES} small wide grouped />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('small-lines')
        expect(wrapper).toHaveClass('wide')
        expect(wrapper).toHaveClass('grouped')
    })

    test('does NOT animate when disabled, even if isTransferMode', () => {
        render(<LineSVGs lines={[MOCK_LINES[0]]} disabled />)

        const img: HTMLImageElement = screen.getByRole('img')
        const wrapper: HTMLElement | null = img.parentElement // The container holds the disabled class

        expect(wrapper).toHaveClass('disabled')
        expect(img).not.toHaveClass('jiggle-animation')
    })

    test('applies vertical and num-lines classes', () => {
        const { container } = render(<LineSVGs lines={MOCK_LINES} vertical numLines={3} />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('vertical')
        expect(wrapper).toHaveClass('num-lines-3')
    })

    test('applies "not-dim" class', () => {
        const { container } = render(<LineSVGs lines={MOCK_LINES} notDim />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('not-dim')
    })

    test('applies className prop', () => {
        const { container } = render(<LineSVGs lines={MOCK_LINES} className='nolan-test-class' />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('nolan-test-class')
    })
})
