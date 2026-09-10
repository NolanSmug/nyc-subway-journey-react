import './Passenger.css'
import { Ref, memo } from 'react'

import { UIMode, useSettingsContext } from '../contexts/SettingsContext'
import { PassengerState } from '../hooks/usePassengerAnimations'
import { usePassengerSprite } from '../hooks/usePassengerSprite'

interface PassengerProps {
    ref?: Ref<HTMLImageElement>
    passengerState: PassengerState
}

const Passenger = ({ ref, passengerState }: PassengerProps) => {
    const activated = useSettingsContext((state) => state.uiMode === UIMode.RIDER)
    const { avatarSrc, cycleGender } = usePassengerSprite()

    if (!activated || !ref) return null

    return (
        <img
            ref={ref}
            src={avatarSrc}
            className={`passenger ${passengerState === PassengerState.WALKING ? 'walking' : ''}`}
            onPointerDown={cycleGender}
            alt='passenger'
        />
    )
}

export default memo(Passenger)
