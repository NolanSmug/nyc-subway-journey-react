import { render, screen, fireEvent } from '@testing-library/react'
import ActionButton from '../ActionButton'

describe('ActionButton', () => {
    test('Image buttons trigger onClick on POINTER DOWN', () => {
        const handleClick = jest.fn()
        render(<ActionButton imageSrc='test.svg' onClick={handleClick} />)

        const button = screen.getByRole('button')

        fireEvent.pointerDown(button)
        expect(handleClick).toHaveBeenCalledTimes(1)

        fireEvent.pointerUp(button)
        expect(handleClick).toHaveBeenCalledTimes(1) // Should NOT fire again
    })

    test('text-only buttons trigger onClick on CLICK', () => {
        const handleClick = jest.fn()
        render(<ActionButton label='Test' onClick={handleClick} />)

        const button = screen.getByRole('button')

        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('applies rotationDegrees style', () => {
        render(<ActionButton imageSrc='arrow.svg' rotateDegrees={90} />)

        const img: HTMLImageElement = screen.getByRole('img')
        expect(img).toHaveStyle('transform: rotate(-90deg)')
    })

    test('does not handle clicks when disabled', () => {
        const handleClick = jest.fn()
        render(<ActionButton label='Disabled' disabled onClick={handleClick} />)

        const wrapper: HTMLElement | null = screen.getByText('Disabled').closest('.action-button-wrapper')

        expect(wrapper).toHaveClass('disabled')
    })
})
