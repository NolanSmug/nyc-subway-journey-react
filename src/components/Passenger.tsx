import './Passenger.css'
import React, { forwardRef, useCallback } from 'react'

import { GameMode, Gender, useSettingsContext } from '../contexts/SettingsContext'
import { PassengerState } from '../hooks/usePassenger'

import HUMAN_MALE_WHITE from '../images/human-male-w.svg'
import HUMAN_MALE_BLACK from '../images/human-male-b.svg'
import HUMAN_FEMALE_WHITE from '../images/human-female-w.svg'
import HUMAN_FEMALE_BLACK from '../images/human-female-b.svg'
import HUMAN_OTHER_WHITE from '../images/human-other-w.svg'
import HUMAN_OTHER_BLACK from '../images/human-other-b.svg'

interface PassengerProps {
    passengerState: PassengerState
}

const Passenger = forwardRef<HTMLImageElement, PassengerProps>(({ passengerState }, ref) => {
    const darkMode = useSettingsContext((state) => state.darkMode)
    const passengerGender = useSettingsContext((state) => state.passengerGender)
    const setPassengerGender = useSettingsContext((state) => state.setPassengerGender)
    const activated = useSettingsContext((state) => state.gameMode === GameMode.RIDER)

    if (!activated) return null

    const getGenderSVG = useCallback(() => {
        if (passengerGender === Gender.MALE) {
            return darkMode ? HUMAN_MALE_WHITE : HUMAN_MALE_BLACK
        } else if (passengerGender === Gender.FEMALE) {
            return darkMode ? HUMAN_FEMALE_WHITE : HUMAN_FEMALE_BLACK
        } else {
            return darkMode ? HUMAN_OTHER_WHITE : HUMAN_OTHER_BLACK
        }
    }, [passengerGender, darkMode])

    const selectNewGender = useCallback(() => {
        if (passengerGender === Gender.MALE) {
            setPassengerGender(Gender.FEMALE)
        } else if (passengerGender === Gender.FEMALE) {
            setPassengerGender(Gender.OTHER)
        } else {
            setPassengerGender(Gender.MALE)
        }
    }, [passengerGender, setPassengerGender])

    return (
        <img
            ref={ref}
            src={getGenderSVG()}
            className={`passenger ${passengerState === PassengerState.WALKING ? 'walking' : ''}`}
            onMouseDown={selectNewGender}
            alt='passenger'
        />
    )
})

export default React.memo(Passenger)
