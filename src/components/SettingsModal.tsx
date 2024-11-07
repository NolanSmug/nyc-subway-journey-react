// SettingsModal.tsx
import React, { useState, useEffect, useRef } from 'react'
import ActionButton from './ActionButton'
import SettingsButton from './SettingsButton'
import './SettingsModal.css'

import GEAR_BLACK from '../images/settings-icon-b.svg'
import GEAR_WHITE from '../images/settings-icon-w.svg'

export interface SettingsUmbrellaProps {
    toggleActions: React.ReactElement<typeof SettingsButton>[]
    darkMode: boolean
}

const SettingsUmbrella = ({ toggleActions, darkMode }: SettingsUmbrellaProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target instanceof Node)) return

            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="settings-umbrella">
            <div ref={buttonRef}>
                <ActionButton
                    className="settings-trigger"
                    imageSrc={darkMode ? GEAR_WHITE : GEAR_BLACK}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            <div ref={popupRef} className={`settings-popup ${isOpen ? 'visible' : 'hidden'}`}>
                {toggleActions?.map((action, index) => (
                    <div key={index}>{action}</div>
                ))}

                <div className="settings-popup-arrow" />
            </div>
        </div>
    )
}

export default SettingsUmbrella
