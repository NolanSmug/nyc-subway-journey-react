import React, { useState, ReactNode, useMemo, useCallback } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { PassengerPosition, PassengerState, CENTER_PLATFORM_POS } from '../hooks/usePassengerActions'

interface UIContextProps {
    isTransferMode: boolean
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>

    isLandingPage: boolean
    setIsLandingPage: React.Dispatch<React.SetStateAction<boolean>>

    passengerPosition: PassengerPosition
    setPassengerPosition: React.Dispatch<React.SetStateAction<PassengerPosition>>
    passengerState: PassengerState
    setPassengerState: React.Dispatch<React.SetStateAction<PassengerState>>
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [isLandingPage, setIsLandingPage] = useState<boolean>(() => (process.env.REACT_APP_USE_DEV_API === 'true' ? false : true))
    const [passengerPosition, setPassengerPosition] = useState<PassengerPosition>(CENTER_PLATFORM_POS)
    const [passengerState, setPassengerState] = useState<PassengerState>(PassengerState.CENTER_PLATFORM)

    const toggleTransferMode = useCallback(() => setIsTransferMode((prev) => !prev), [])

    const value = useMemo(
        () => ({
            isTransferMode,
            setIsTransferMode,
            isLandingPage,
            setIsLandingPage,
            passengerPosition,
            setPassengerPosition,
            passengerState,
            setPassengerState,
            toggleTransferMode,
        }),
        [isTransferMode, isLandingPage, passengerPosition, passengerState, toggleTransferMode]
    )

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUIContext = <T,>(selector: (state: UIContextProps) => T): T => {
    const context = useContextSelector(UIContext, (state) => {
        if (state === undefined) {
            throw new Error('useUIContext must be used within a UIProvider')
        }
        return selector(state)
    })

    return context
}
