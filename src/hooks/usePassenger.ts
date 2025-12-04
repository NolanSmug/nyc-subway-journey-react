import { useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react'
import { Direction } from '../logic/LineManager'

export enum PassengerState {
    WALKING,
    CENTER_PLATFORM,
    UPTOWN_TRAIN,
    DOWNTOWN_TRAIN,
    TRANSFER_PLATFORM,
    STAIRCASE,
    TRANSFER_TUNNEL,
}

export enum PassengerAction {
    BOARD_TRAIN,
    DEBOARD_TRAIN,
    UP_STAIRCASE,
    DOWN_STAIRCASE,
}

export const PASSENGER_WALK_DURATIONS: Record<PassengerAction, number> = {
    [PassengerAction.BOARD_TRAIN]: 250,
    [PassengerAction.DEBOARD_TRAIN]: 500,
    [PassengerAction.DOWN_STAIRCASE]: 1000,
    [PassengerAction.UP_STAIRCASE]: 1250,
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function usePassenger() {
    const [passengerState, setPassengerState] = useState<PassengerState>(PassengerState.CENTER_PLATFORM)
    const ref = useRef<HTMLImageElement>(null)

    const toCenterPlatform = useCallback(() => {
        const platform = document.querySelector('.platform-container')?.getBoundingClientRect()
        if (!ref.current || !platform) return

        const startX = platform.width / 2
        const startY = platform.height / 2

        ref.current.style.transition = 'none' // no need to animate motion for this step
        ref.current.style.transform = `translate(${startX}px, ${startY}px) translate(-50%, -50%)`

        setPassengerState(PassengerState.CENTER_PLATFORM)
    }, [setPassengerState])

    // INITIAL CENTER PLATFORM POSITION
    useLayoutEffect(() => {
        toCenterPlatform()
    }, [])

    const getRelativePosition = (target: HTMLElement) => {
        const platform = document.querySelector('.platform-container')?.getBoundingClientRect()
        const rect = target.getBoundingClientRect()

        if (!platform || !rect) return null

        return {
            x: rect.left - platform.left + rect.width / 2,
            y: rect.top - platform.top + rect.height / 2,
        }
    }

    const walkTo = useCallback(async (x: number, y: number, action: PassengerAction) => {
        if (!ref.current) return

        const duration: number = PASSENGER_WALK_DURATIONS[action]

        setPassengerState(PassengerState.WALKING)

        ref.current.style.transition = `transform ${duration}ms linear`
        ref.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`

        await new Promise((resolve) => setTimeout(resolve, duration))
    }, [])

    const boardTrain = useCallback(
        async (door: HTMLElement, direction: Direction) => {
            const pos = getRelativePosition(door)

            if (!pos) return

            await walkTo(pos.x, pos.y, PassengerAction.BOARD_TRAIN)
            setPassengerState(direction === Direction.UPTOWN ? PassengerState.UPTOWN_TRAIN : PassengerState.DOWNTOWN_TRAIN)
        },
        [walkTo]
    )

    const deboard = useCallback(async () => {
        const platform = document.querySelector('.platform-container')?.getBoundingClientRect()
        if (!platform) return

        await walkTo(platform.width / 8, platform.height / 2, PassengerAction.DEBOARD_TRAIN)
        setPassengerState(PassengerState.TRANSFER_PLATFORM)
    }, [walkTo])

    const transferDownStairs = useCallback(
        async (stairsDown: HTMLDivElement) => {
            const pos = getRelativePosition(stairsDown)

            if (!pos) return

            await walkTo(pos.x, pos.y, PassengerAction.DOWN_STAIRCASE)
            setPassengerState(PassengerState.STAIRCASE)
        },
        [walkTo]
    )

    const transferUpStairs = useCallback(async () => {
        setPassengerState(PassengerState.WALKING)
        // manual delay - passenger technically doesn't move across tunnel (rather the tunnel moves to create this illusion)
        await delay(PASSENGER_WALK_DURATIONS[PassengerAction.UP_STAIRCASE])
        setPassengerState(PassengerState.TRANSFER_TUNNEL)
    }, [delay])

    const resetState = useCallback(() => {
        toCenterPlatform()
    }, [toCenterPlatform])

    return useMemo(
        () => ({
            ref,
            passengerState,
            boardTrain,
            deboard,
            transferDownStairs,
            transferUpStairs,
            resetState,
        }),
        [ref, passengerState, boardTrain, deboard, transferDownStairs, transferUpStairs, resetState]
    )
}
