import { useCallback } from 'react'
import { configurePassengerTransition } from './useCSSProperties'

export type PassengerPosition = {
    x: number
    y?: number
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
    const walkPassenger = useCallback(
        (passengerAction: PassengerAction, toPassengerState: PassengerState, doorElement?: HTMLDivElement) => {
            const platformContainer: DOMRect | undefined = document.querySelector('.platform-container')?.getBoundingClientRect()
            const doorRect: DOMRect | undefined = doorElement?.getBoundingClientRect() || undefined
            const walkingTime: number | undefined = PASSENGER_WALK_DURATIONS.get(passengerAction)

            if (platformContainer) {
                configurePassengerTransition(walkingTime)
                setPassengerState(PassengerState.WALKING)

                switch (passengerAction) {
                    case PassengerAction.BOARD_TRAIN:
                        setPassengerPosition({
                            x: -311,
                            y: doorRect && doorRect.top + doorRect.height / 2 - platformContainer.top,
                        })
                        break
                    case PassengerAction.DEBOARD_TRAIN:
                        setPassengerPosition({
                            x: -311,
                            y: platformContainer.height / 2, // center of platform
                        })
                        break
                    default:
                        setPassengerPosition(CENTER_PLATFORM_POS)
                        break
                }

                const walkingDelay = setTimeout(() => setPassengerState(toPassengerState), walkingTime)
                return () => clearTimeout(walkingDelay)
            }
        },

        [setPassengerPosition, setPassengerState]
    )

    return {
        walkPassenger,
    }
}
