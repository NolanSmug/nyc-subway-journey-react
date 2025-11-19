import { useCallback, useEffect, useRef } from 'react'
import { setPassengerTransitionDuration } from './useCSSProperties'

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
    STAIRCASE,
    TRANSFER_TUNNEL,
}

export enum PassengerAction {
    BOARD_TRAIN,
    DEBOARD_TRAIN,
    DOWN_STAIRCASE,
}

export const CENTER_PLATFORM_POS: PassengerPosition = { x: 20, y: window.innerHeight / 3 }

// TODO: update this to use two PassengerStates instead of a PassengerAction
export const PASSENGER_WALK_DURATIONS: Map<PassengerAction, number> = new Map([
    [PassengerAction.BOARD_TRAIN, 250],
    [PassengerAction.DEBOARD_TRAIN, 500],
    [PassengerAction.DOWN_STAIRCASE, 250],
])

type UsePassengerActionsParams = {
    passengerState: PassengerState
    setPassengerPosition: (pos: PassengerPosition) => void
    setPassengerState: (state: PassengerState) => void
}

export default function usePassengerActions({ passengerState, setPassengerPosition, setPassengerState }: UsePassengerActionsParams) {
    const walkTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Clear timeout on umount
    useEffect(() => {
        return () => {
            if (walkTimeoutRef.current) {
                clearTimeout(walkTimeoutRef.current)
            }
        }
    }, [])

    // Clear timeout when no longer walking
    useEffect(() => {
        if (passengerState !== PassengerState.WALKING && walkTimeoutRef.current) {
            clearTimeout(walkTimeoutRef.current)
            walkTimeoutRef.current = null
        }
    }, [passengerState])

    const walkPassenger = useCallback(
        (passengerAction: PassengerAction, toPassengerState: PassengerState, element?: HTMLDivElement) => {
            const platformContainer: DOMRect | undefined = document.querySelector('.platform-container')?.getBoundingClientRect()
            const selectedElement: DOMRect | undefined = element?.getBoundingClientRect()
            const walkingTime: number = PASSENGER_WALK_DURATIONS.get(passengerAction) ?? 250

            if (!platformContainer) {
                console.error('Platform container DNE')
                return
            }

            let toPosition: PassengerPosition = CENTER_PLATFORM_POS

            switch (passengerAction) {
                case PassengerAction.BOARD_TRAIN:
                    if (selectedElement) {
                        toPosition = {
                            x: -311, // TODO: figure out dynamic value
                            y: selectedElement.top + selectedElement.height / 2 - platformContainer.top,
                        }
                    } else {
                        console.warn('Door element not found for passenger when boarding train')
                    }
                    break
                case PassengerAction.DEBOARD_TRAIN:
                    toPosition = {
                        x: -311, // TODO: figure out dynamic value
                        y: platformContainer.height / 2, // center of platform
                    }
                    break
                case PassengerAction.DOWN_STAIRCASE:
                    if (selectedElement) {
                        toPosition = {
                            x: selectedElement.x - platformContainer.x + selectedElement.width / 2,
                            y: selectedElement.top + selectedElement.height / 2 - platformContainer.top,
                        }
                    }
                    break
                default:
                    break
            }

            if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current)

            setPassengerTransitionDuration(walkingTime)
            setPassengerPosition(toPosition)

            requestAnimationFrame(() => {
                setPassengerState(PassengerState.WALKING)
            })

            // when done with walking, set the passenger state back
            walkTimeoutRef.current = setTimeout(() => {
                setPassengerState(toPassengerState)
                walkTimeoutRef.current = null
            }, walkingTime)
        },

        [setPassengerPosition, setPassengerState]
    )

    return {
        walkPassenger,
    }
}
