import { useCallback } from 'react'
import { setPassengerWalkingDuration } from './useCSSProperties'

export type PassengerPosition = {
    x: number
    y: number
}

export enum PassengerState {
    WALKING,
    CENTER_PLATFORM,
    TRANSFER_PLATFORM,
    UPTOWN_TRAIN,
    DOWNTOWN_TRAIN,
}

export enum PassengerAction {
    BOARD_TRAIN,
    DEBOARD_TRAIN,
}

export const CENTER_PLATFORM_POS: PassengerPosition = { x: 20, y: window.innerHeight / 3 }

export const PASSENGER_WALK_DURATIONS: Map<PassengerAction, number> = new Map([
    [PassengerAction.BOARD_TRAIN, 1250],
    [PassengerAction.DEBOARD_TRAIN, 1000],
])

type UsePassengerActionsParams = {
    setPassengerPosition: (pos: PassengerPosition) => void
    setPassengerState: (state: PassengerState) => void
}
export default function usePassengerActions({ setPassengerPosition, setPassengerState }: UsePassengerActionsParams) {
    const boardTrain = useCallback(
        (doorElement: HTMLDivElement, toPassengerState: PassengerState) => {
            const doorRect: DOMRect = doorElement.getBoundingClientRect()
            const platformContainer: DOMRect | undefined = document.querySelector('.platform-container')?.getBoundingClientRect()
            const walkingTime: number | undefined = PASSENGER_WALK_DURATIONS.get(PassengerAction.BOARD_TRAIN)
            if (platformContainer) {
                setPassengerWalkingDuration(walkingTime)
                setPassengerState(PassengerState.WALKING)
                setPassengerPosition({
                    x: -311,
                    y: doorRect.top + doorRect.height / 2 - platformContainer.top,
                })
                const walkingDelay = setTimeout(
                    () => setPassengerState(toPassengerState),
                    PASSENGER_WALK_DURATIONS.get(PassengerAction.BOARD_TRAIN)
                )
                return () => clearTimeout(walkingDelay)
            }
        },
        [setPassengerPosition, setPassengerState]
    )
    const deboardTrain = useCallback(
        (toPassengerState: PassengerState) => {
            const platformContainer: DOMRect | undefined = document.querySelector('.platform-container')?.getBoundingClientRect()
            const walkingTime: number | undefined = PASSENGER_WALK_DURATIONS.get(PassengerAction.DEBOARD_TRAIN)
            if (platformContainer) {
                setPassengerWalkingDuration(walkingTime)
                setPassengerState(PassengerState.TRANSFER_PLATFORM)
                setPassengerPosition({
                    x: -311,
                    y: platformContainer.height / 2, // center of platform
                })
                const walkingDelay = setTimeout(() => setPassengerState(toPassengerState), walkingTime)
                return () => clearTimeout(walkingDelay)
            }
        },
        [setPassengerPosition]
    )

    return {
        boardTrain,
        deboardTrain,
    }
}
