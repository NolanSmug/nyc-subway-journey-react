import React, { useState, useEffect, useRef, ReactNode } from 'react'
import ActionButton from './ActionButton'

import './UmbrellaButton.css'
import { useUIContext } from '../../contexts/UIContext'

export interface UmbrellaButtonProps {
    openingButtonsW_B: string[] // [white, black]
    umbrellaContent: ReactNode
    below?: boolean
    visible?: boolean
}

const UmbrellaButton = ({ openingButtonsW_B, umbrellaContent, below, visible }: UmbrellaButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLDivElement | null>(null)

    const { darkMode } = useUIContext()

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

    if (!visible) return null

    return (
        <div ref={buttonRef}>
            <ActionButton imageSrc={darkMode ? openingButtonsW_B[0] : openingButtonsW_B[1]} onMouseDown={togglePopup} />

            {/* <div ref={popupRef} className={`umbrella-content not-dim ${isOpen ? "visible" : "hidden"} ${below ? "below" : ""}`}>
                {umbrellaContent}
                <div className="popup-arrow" />
            </div> */}
            {isOpen && visible && (
                <div
                    ref={popupRef}
                    className={`umbrella-content not-dim ${isOpen ? 'visible' : 'hidden'} ${below ? 'below' : 'above'}`}
                >
                    {umbrellaContent}
                    <div className='popup-arrow' />
                </div>
            )}
        </div>
    )
}

export default UmbrellaButton
