import React, { useState, useEffect, useRef } from 'react'
import ActionButton from './ActionButton'
import SettingsButton from './SettingsButton'
import { useUIContext } from '../contexts/UIContext'
import './SettingsUmbrella.css'

import L_MODE from '../images/light-mode-icon.svg'
import D_MODE from '../images/dark-mode-icon.svg'
import GEAR_BLACK from '../images/settings-icon-b.svg'
import GEAR_WHITE from '../images/settings-icon-w.svg'
import UPCOMING_STATIONS_BLACK from '../images/upcoming-stations-icon-b.svg'
import UPCOMING_STATIONS_WHITE from '../images/upcoming-stations-icon-w.svg'

const SettingsUmbrella = () => {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLDivElement | null>(null)

    const {
        darkMode,
        setDarkMode,
        upcomingStationsVisible,
        setUpcomingStationsVisible,
        forceRenderRefresh,
        setUpcomingStationsVertical,
    } = useUIContext()

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
                <SettingsButton label="Theme" imgSrc={darkMode ? L_MODE : D_MODE} onClick={() => setDarkMode((prev) => !prev)} />
                <SettingsButton
                    label="Upcoming Stations"
                    imgSrc={darkMode ? UPCOMING_STATIONS_WHITE : UPCOMING_STATIONS_BLACK}
                    onClick={() => {
                        setUpcomingStationsVisible((prev) => !prev)
                        forceRenderRefresh()
                    }}
                />
                <SettingsButton
                    label="Upcoming Stations Format"
                    imgSrc={darkMode ? UPCOMING_STATIONS_WHITE : UPCOMING_STATIONS_BLACK}
                    onClick={() => {
                        if (upcomingStationsVisible) {
                            setUpcomingStationsVertical((prev) => !prev)
                        }
                    }}
                />
                <div className="settings-popup-arrow" />
            </div>
        </div>
    )
}

export default SettingsUmbrella
