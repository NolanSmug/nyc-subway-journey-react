import React, { useState, useEffect, useRef, ReactNode } from 'react'

import { useUIContext } from '../contexts/UIContext'
import './UmbrellaButton.css'
import ActionButton from './ActionButton'

export interface UmbrellaButtonProps {
    openingButtonWhite: string
    openingButtonBlack: string
    umbrellaContent: ReactNode
    below?: boolean
}

const UmbrellaButton = ({ openingButtonWhite, openingButtonBlack, umbrellaContent, below }: UmbrellaButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLDivElement | null>(null)

    const { darkMode } = useUIContext()

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target instanceof Node)) return

            if (isOpen && !popupRef.current?.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    return (
        <>
            <div ref={buttonRef}>
                <ActionButton
                    className="umbrella-button"
                    imageSrc={darkMode ? openingButtonWhite : openingButtonBlack}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            <div ref={popupRef} className={`umbrella-content ${isOpen ? 'visible' : 'hidden'} ${below ? 'below' : ''}`}>
                {umbrellaContent}
                <div className="popup-arrow" />
            </div>
        </>
    )
}

export default UmbrellaButton
