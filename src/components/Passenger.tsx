import './Passenger.css'
import React from 'react'

import { GameMode, useSettingsContext } from '../contexts/SettingsContext'
import { PassengerState } from '../hooks/usePassengerAnimations'
import { usePassengerSprite } from '../hooks/usePassengerSprite'

interface PassengerProps {
    ref?: React.Ref<HTMLImageElement>
    passengerState: PassengerState
}

const Passenger = ({ ref, passengerState }: PassengerProps) => {
    const activated = useSettingsContext((state) => state.gameMode === GameMode.RIDER)
    const { avatarSrc, cycleGender } = usePassengerSprite()

    if (!activated || !ref) return null

    return (
        <img
            ref={ref}
            src={avatarSrc}
            className={`passenger ${passengerState === PassengerState.WALKING ? 'walking' : ''}`}
            onMouseDown={cycleGender}
            alt='passenger'
        />
    )
}

export default React.memo(Passenger)
