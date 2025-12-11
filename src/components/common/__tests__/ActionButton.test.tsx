import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ActionButton from '../ActionButton'

describe('ActionButton', () => {
    test('Image buttons trigger onClick on MOUSE DOWN', () => {
        const handleClick = jest.fn()

        render(<ActionButton imageSrc='test.svg' label='Image Button' onClick={handleClick} />)

        const button: HTMLButtonElement = screen.getByRole('button')

        fireEvent.mouseDown(button)
        expect(handleClick).toHaveBeenCalledTimes(1)

        fireEvent.mouseUp(button)
        expect(handleClick).toHaveBeenCalledTimes(1) // Should NOT fire again
    })

    test('Text-only buttons trigger onClick on MOUSE UP', () => {
        const handleClick = jest.fn()

        render(<ActionButton label='Text Button' onClick={handleClick} />)

        const button: HTMLButtonElement = screen.getByRole('button')

        fireEvent.mouseDown(button)
        expect(handleClick).not.toHaveBeenCalled() // Should NOT fire yet

        fireEvent.mouseUp(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('Applies rotation style when provided', () => {
        render(<ActionButton imageSrc='arrow.svg' rotateDegrees={90} />)

        const img: HTMLImageElement = screen.getByRole('img')
        expect(img).toHaveStyle('transform: rotate(-90deg)')
    })

    test('Does not handle clicks when disabled', () => {
        const handleClick = jest.fn()
        render(<ActionButton label='Disabled' disabled onClick={handleClick} />)

        const wrapper: HTMLElement | null = screen.getByText('Disabled').closest('.action-button-wrapper')

        expect(wrapper).toHaveClass('disabled')
    })
})
