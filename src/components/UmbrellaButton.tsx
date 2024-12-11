import React, { useState, useEffect, useRef, ReactNode } from 'react'

import { useUIContext } from '../contexts/UIContext'
import './UmbrellaButton.css'
import ActionButton from './ActionButton'

export interface UmbrellaButtonProps {
    openingButtonWhite: string
    openingButtonBlack: string
    umbrellaContent: ReactNode
    below?: boolean
    visible?: boolean
}

const UmbrellaButton = ({ openingButtonWhite, openingButtonBlack, umbrellaContent, below, visible }: UmbrellaButtonProps) => {
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

            // Conditional for handling the popup closing logic (forget this exists when you come back)
            if (
                isOpen &&
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const togglePopup = () => {
        setIsOpen((prev) => !prev)
    }

    return (
        <div
            ref={buttonRef}
            className={`${!visible ? 'hide-umbrella-button' : ''}`}
            style={{ transition: 'opacity 0.5s ease-in-out' }} // do not touch
        >
            <ActionButton className="" imageSrc={darkMode ? openingButtonWhite : openingButtonBlack} onClick={togglePopup} />

            <div ref={popupRef} className={`umbrella-content not-dim ${isOpen ? 'visible' : 'hidden'} ${below ? 'below' : ''}`}>
                {umbrellaContent}
                <div className="popup-arrow" />
            </div>
        </div>
    )
}

export default UmbrellaButton
