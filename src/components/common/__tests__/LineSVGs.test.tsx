import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LineSVGs from '../LineSVGs'

jest.mock('../../../contexts/UIContext', () => ({
    useUIContext: (selector: any) =>
        selector({
            isTransferMode: true,
        }),
}))

describe('LineSVGs', () => {
    const MOCK_PATHS: string[] = ['../../../assets/images/j.svg', 'l../../../assets/images/m.svg', '../../../assets/images/z.svg']

    test('Renders the correct number of line icons', () => {
        render(<LineSVGs svgPaths={MOCK_PATHS} />)

        const images = screen.getAllByRole('img')
        expect(images).toHaveLength(3)
        expect(images[0]).toHaveAttribute('src', MOCK_PATHS[0])
    })

    test('Applies "jiggle-animation" class when isTransferMode', () => {
        render(<LineSVGs svgPaths={[MOCK_PATHS[0]]} />)

        const img = screen.getByRole('img')
        expect(img).toHaveClass('jiggle-animation')
    })

    test('Handles clicking a specific line', () => {
        const handleSelect = jest.fn()

        render(<LineSVGs svgPaths={MOCK_PATHS} onTransferSelect={handleSelect} />)

        const images: HTMLImageElement[] = screen.getAllByRole('img')

        fireEvent.mouseDown(images[1])

        expect(handleSelect).toHaveBeenCalledWith(1)
    })

    test('Applies wrapper classes (small, wide, grouped)', () => {
        const { container } = render(<LineSVGs svgPaths={MOCK_PATHS} small wide grouped />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('small')
        expect(wrapper).toHaveClass('wide')
        expect(wrapper).toHaveClass('grouped')
    })

    test('Does NOT animate when disabled, even if isTransferMode', () => {
        render(<LineSVGs svgPaths={[MOCK_PATHS[0]]} disabled />)

        const img: HTMLImageElement = screen.getByRole('img')
        const wrapper: HTMLElement | null = img.parentElement // The container holds the disabled class

        expect(wrapper).toHaveClass('disabled')
        expect(img).not.toHaveClass('jiggle-animation')
    })

    test('Applies vertical and num-lines classes', () => {
        const { container } = render(<LineSVGs svgPaths={MOCK_PATHS} vertical numLines={3} />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('vertical')
        expect(wrapper).toHaveClass('num-lines-3')
    })

    test('Applies "not-dim" class', () => {
        const { container } = render(<LineSVGs svgPaths={MOCK_PATHS} notDim />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('not-dim')
    })

    test('Applies className prop', () => {
        const { container } = render(<LineSVGs svgPaths={MOCK_PATHS} className='nolan-test-class' />)

        const wrapper: ChildNode | null = container.firstChild

        expect(wrapper).toHaveClass('nolan-test-class')
    })
})
