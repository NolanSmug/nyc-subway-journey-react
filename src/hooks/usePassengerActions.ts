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
    TRANSFER_TUNNEL,
}

export enum PassengerAction {
    BOARD_TRAIN,
    DEBOARD_TRAIN,
    TO_STAIRCASE,
}

export const CENTER_PLATFORM_POS: PassengerPosition = { x: 20, y: window.innerHeight / 3 }

export const PASSENGER_WALK_DURATIONS: Map<PassengerAction, number> = new Map([
    [PassengerAction.BOARD_TRAIN, 250],
    [PassengerAction.DEBOARD_TRAIN, 500],
    [PassengerAction.TO_STAIRCASE, 250],
])

type UsePassengerActionsParams = {
    setPassengerPosition: (pos: PassengerPosition) => void
    setPassengerState: (state: PassengerState) => void
}
export default function usePassengerActions({ setPassengerPosition, setPassengerState }: UsePassengerActionsParams) {
    const walkPassenger = useCallback(
        (passengerAction: PassengerAction, toPassengerState: PassengerState, element?: HTMLDivElement) => {
            const platformContainer: DOMRect | undefined = document.querySelector('.platform-container')?.getBoundingClientRect()
            const selectedElement: DOMRect | undefined = element?.getBoundingClientRect()
            const walkingTime: number | undefined = PASSENGER_WALK_DURATIONS.get(passengerAction)

            if (platformContainer) {
                configurePassengerTransition(walkingTime)
                setPassengerState(PassengerState.WALKING)

                switch (passengerAction) {
                    case PassengerAction.BOARD_TRAIN:
                        if (selectedElement) {
                            setPassengerPosition({
                                x: -311, // TODO: figure out dynamic value
                                y: selectedElement.top + selectedElement.height / 2 - platformContainer.top,
                            })
                        }
                        break
                    case PassengerAction.DEBOARD_TRAIN:
                        setPassengerPosition({
                            x: -311, // TODO: figure out dynamic value
                            y: platformContainer.height / 2, // center of platform
                        })
                        break
                    case PassengerAction.TO_STAIRCASE:
                        // if (selectedElement) {
                        //     setPassengerPosition({
                        //         x: selectedElement.left,
                        //         y: selectedElement.top + selectedElement.height / 2 - platformContainer.top,
                        //     })
                        // }
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
