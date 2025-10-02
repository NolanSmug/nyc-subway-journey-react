import React, { useEffect, useMemo, useRef } from 'react'
import './Door.css'
import { useUIContext } from '../../contexts/UIContext'
import usePassengerActions, { PassengerAction, PassengerState } from '../../hooks/usePassengerActions'
import { Direction } from '../../logic/LineManager'

interface DoorProps {
    isLeft?: boolean
    hasPassenger?: boolean
    direction?: Direction
}

const Door = ({ isLeft, hasPassenger, direction }: DoorProps) => {
    const setPassengerPosition = useUIContext((state) => state.setPassengerPosition)
    const setPassengerState = useUIContext((state) => state.setPassengerState)

    const doorRef = useRef<HTMLDivElement | null>(null)

    const passengerActions = useMemo(() => {
        return { setPassengerPosition, setPassengerState }
    }, [setPassengerPosition, setPassengerState])

    const { walkPassenger } = usePassengerActions({
        setPassengerPosition: passengerActions.setPassengerPosition,
        setPassengerState: passengerActions.setPassengerState,
    })

    useEffect(() => {
        // Only run passenger logic once per passenger
        if (doorRef.current && hasPassenger) {
            const toPassengerState: PassengerState =
                direction === Direction.DOWNTOWN ? PassengerState.DOWNTOWN_TRAIN : PassengerState.UPTOWN_TRAIN
            walkPassenger(PassengerAction.BOARD_TRAIN, toPassengerState, doorRef.current)
        }
    }, [direction, hasPassenger])

    return (
        <div
            ref={hasPassenger ? doorRef : null}
            className={`door ${isLeft ? 'door-left' : ''} ${hasPassenger ? 'door-passenger' : ''}`}
        ></div>
    )
}

export default Door
