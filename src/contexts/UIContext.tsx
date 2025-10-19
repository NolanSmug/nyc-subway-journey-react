import React, { useState, ReactNode, useMemo, useCallback } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { PassengerPosition, PassengerState, CENTER_PLATFORM_POS } from '../hooks/usePassengerActions'

export enum UpcomingStationsLayout {
    HORIZONTAL,
    VERTICAL,
}

interface UIContextProps {
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
    isTransferMode: boolean
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>

    isLandingPage: boolean
    setIsLandingPage: React.Dispatch<React.SetStateAction<boolean>>

    upcomingStationsVisible: boolean
    upcomingStationsLayout: UpcomingStationsLayout
    setUpcomingStationsVisible: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingStationsLayout: React.Dispatch<React.SetStateAction<UpcomingStationsLayout>>
    toggleUpcomingStationsLayout: () => void
    isVerticalLayout: () => boolean
    isHorizontalLayout: () => boolean

    passengerPosition: PassengerPosition
    setPassengerPosition: React.Dispatch<React.SetStateAction<PassengerPosition>>
    passengerState: PassengerState
    setPassengerState: React.Dispatch<React.SetStateAction<PassengerState>>
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

// Provides values/state variables related to the user interface
export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(true)
    const [upcomingStationsLayout, setUpcomingStationsLayout] = useState<UpcomingStationsLayout>(UpcomingStationsLayout.HORIZONTAL)
    const [isLandingPage, setIsLandingPage] = useState<boolean>(() => (process.env.REACT_APP_USE_DEV_API === 'true' ? false : true))
    const [passengerPosition, setPassengerPosition] = useState<PassengerPosition>(CENTER_PLATFORM_POS)
    const [passengerState, setPassengerState] = useState<PassengerState>(PassengerState.CENTER_PLATFORM)

    const toggleUpcomingStationsLayout = useCallback(() => {
        if (upcomingStationsVisible) {
            setUpcomingStationsLayout(isHorizontalLayout() ? UpcomingStationsLayout.VERTICAL : UpcomingStationsLayout.HORIZONTAL)
        }
    }, [upcomingStationsLayout])
    const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), [])
    const toggleTransferMode = useCallback(() => setIsTransferMode((prev) => !prev), [])

    const isVerticalLayout = useCallback(() => upcomingStationsLayout === UpcomingStationsLayout.VERTICAL, [upcomingStationsLayout])
    const isHorizontalLayout = useCallback(() => upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL, [upcomingStationsLayout])

    const value = useMemo(
        () => ({
            darkMode,
            isTransferMode,
            upcomingStationsVisible,
            upcomingStationsLayout,
            setDarkMode,
            setIsTransferMode,
            setUpcomingStationsVisible,
            setUpcomingStationsLayout,
            isLandingPage,
            setIsLandingPage,
            passengerPosition,
            setPassengerPosition,
            passengerState,
            setPassengerState,
            toggleDarkMode,
            toggleTransferMode,
            toggleUpcomingStationsLayout,
            isVerticalLayout,
            isHorizontalLayout,
        }),
        [
            darkMode,
            isTransferMode,
            upcomingStationsVisible,
            upcomingStationsLayout,
            isLandingPage,
            passengerPosition,
            passengerState,
            toggleDarkMode,
            toggleTransferMode,
            toggleUpcomingStationsLayout,
            isVerticalLayout,
            isHorizontalLayout,
        ]
    )

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

// export const useUIContext = () => {
//     const context = useContext(UIContext)
//     if (context === undefined) {
//         throw new Error('useUIContext must be used within a UIProvider')
//     }
//     return context
// }

export const useUIContext = <T,>(selector: (state: UIContextProps) => T): T => {
    const context = useContextSelector(UIContext, (state) => {
        if (state === undefined) {
            throw new Error('useUIContext must be used within a UIProvider')
        }
        return selector(state)
    })

    return context
}
