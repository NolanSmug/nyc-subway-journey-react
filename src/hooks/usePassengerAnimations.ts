import { useState, useRef, useCallback, useMemo, RefObject } from 'react'
import { Direction } from '../logic/LineManager'
import { useUIContext } from '../contexts/UIContext'

export enum PassengerState {
    WALKING,
    CENTER_PLATFORM,
    UPTOWN_TRAIN,
    DOWNTOWN_TRAIN,
    TRANSFER_PLATFORM,
    STAIRCASE,
    TRANSFER_TUNNEL,
    LANDING_PAGE,
}

export enum PassengerAction {
    BOARD_TRAIN,
    DEBOARD_TRAIN,
    UP_STAIRCASE,
    DOWN_STAIRCASE,
    SWIPE_METROCARD,
}

export const PASSENGER_WALK_DURATIONS: Record<PassengerAction, number> = {
    [PassengerAction.BOARD_TRAIN]: 250,
    [PassengerAction.DEBOARD_TRAIN]: 500,
    [PassengerAction.DOWN_STAIRCASE]: 1000,
    [PassengerAction.UP_STAIRCASE]: 1250,
    [PassengerAction.SWIPE_METROCARD]: 3500,
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function usePassengerAnimations(platformRef: RefObject<HTMLDivElement | null>) {
    const [passengerState, setPassengerState] = useState<PassengerState>(PassengerState.CENTER_PLATFORM)
    const isModalOpen = useUIContext((state) => state.isModalOpen)
    const ref = useRef<HTMLImageElement>(null)

    const toCenterPlatform = useCallback(() => {
        const platform = platformRef.current?.getBoundingClientRect()
        if (!ref.current || !platform) return

        let startX = platform.width / 2
        let startY = platform.height / 2

        // landing modal is active
        if (isModalOpen) {
            const turnstile: HTMLDivElement | null = document.querySelector('.turnstile-arms-container')
            if (turnstile) {
                const turnstilePos = getRelativePosition(turnstile)
                if (turnstilePos) {
                    startX = turnstilePos.x - 250
                    startY = turnstilePos.y - 20
                }
            }
        }

        ref.current.style.transition = 'none' // no need to animate motion for this step
        ref.current.style.transform = `translate(${startX}px, ${startY}px) translate(-50%, -50%)`

        setPassengerState(PassengerState.CENTER_PLATFORM)
    }, [setPassengerState, isModalOpen])

    // INITIAL CENTER PLATFORM POSITION
    // useLayoutEffect(() => {
    //     toCenterPlatform()
    // }, [])

    const getRelativePosition = useCallback((target: HTMLElement) => {
        const platform = platformRef.current?.getBoundingClientRect()
        if (!platform) return null

        const targetRect = target.getBoundingClientRect()

        return {
            x: targetRect.left - platform.left + targetRect.width / 2,
            y: targetRect.top - platform.top + targetRect.height / 2,
        }
    }, [])

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
        [walkTo, getRelativePosition]
    )

    const deboard = useCallback(async () => {
        const platform = platformRef.current?.getBoundingClientRect()
        if (!platform) return

        await walkTo(platform.width / 8, platform.height / 2, PassengerAction.DEBOARD_TRAIN)
        setPassengerState(PassengerState.TRANSFER_PLATFORM)
    }, [walkTo])

    const transferDownStairs = useCallback(
        async (stairsDown?: HTMLDivElement) => {
            if (!stairsDown) return

            const pos = getRelativePosition(stairsDown)

            if (!pos) return

            await walkTo(pos.x, pos.y, PassengerAction.DOWN_STAIRCASE)
            setPassengerState(PassengerState.STAIRCASE)
        },
        [walkTo, getRelativePosition]
    )

    const transferUpStairs = useCallback(async () => {
        setPassengerState(PassengerState.WALKING)
        // manual delay - passenger technically doesn't move across tunnel (rather the tunnel moves to create this illusion)
        await delay(PASSENGER_WALK_DURATIONS[PassengerAction.UP_STAIRCASE])
        setPassengerState(PassengerState.TRANSFER_TUNNEL)
    }, [])

    const turnstileSwipe = useCallback(async () => {
        const turnstile: HTMLDivElement | null = document.querySelector('.turnstile-arms-container')
        const paymentLight: HTMLDivElement | null = document.querySelector('.payment-light')
        if (!turnstile || !paymentLight) return

        const pos = getRelativePosition(turnstile)
        if (!pos) return

        const walkDuration = PASSENGER_WALK_DURATIONS[PassengerAction.SWIPE_METROCARD]

        setTimeout(() => {
            turnstile.style.transform = 'rotate(0deg)'
            paymentLight.classList.add('on')
        }, walkDuration * 0.45)

        setTimeout(() => {
            paymentLight.classList.remove('on')
        }, walkDuration * 0.75)

        await walkTo(pos.x + 250, pos.y - 20, PassengerAction.SWIPE_METROCARD)

        setPassengerState(PassengerState.CENTER_PLATFORM)
    }, [getRelativePosition, walkTo])

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
            turnstileSwipe,
            resetState,
        }),
        [ref, passengerState, boardTrain, deboard, transferDownStairs, transferUpStairs, turnstileSwipe, resetState]
    )
}
