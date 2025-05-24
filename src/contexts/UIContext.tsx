import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react'

export enum UpcomingStationsLayout {
    HORIZONTAL,
    VERTICAL,
}

interface UIContextProps {
    darkMode: boolean
    isTransferMode: boolean
    upcomingStationsVisible: boolean
    upcomingStationsLayout: UpcomingStationsLayout
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingStationsVisible: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingStationsLayout: React.Dispatch<React.SetStateAction<UpcomingStationsLayout>>
    toggleUpcomingStationsLayout: () => void
    isVerticalLayout: () => boolean
    isHorizontalLayout: () => boolean
    isLandingPage: boolean
    setIsLandingPage: React.Dispatch<React.SetStateAction<boolean>>
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

// Provides values/state variables related to the user interface
export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(true)
    const [upcomingStationsLayout, setUpcomingStationsLayout] = useState<UpcomingStationsLayout>(
        UpcomingStationsLayout.HORIZONTAL
    )
    const [isLandingPage, setIsLandingPage] = useState<boolean>(process.env.REACT_APP_USE_DEV_API === 'true' ? false : true)

    function toggleUpcomingStationsLayout(): void {
        if (upcomingStationsVisible) {
            setUpcomingStationsLayout(
                isHorizontalLayout()
                    ? UpcomingStationsLayout.VERTICAL
                    : UpcomingStationsLayout.HORIZONTAL
            )
        }
    }
    const isVerticalLayout = useCallback(
        () => upcomingStationsLayout === UpcomingStationsLayout.VERTICAL,
        [upcomingStationsLayout]
    )

    const isHorizontalLayout = useCallback(
        () => upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL,
        [upcomingStationsLayout]
    )

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
            toggleDarkMode: () => setDarkMode((prev) => !prev),
            toggleTransferMode: () => setIsTransferMode((prev) => !prev),
            toggleUpcomingStationsLayout,
            isVerticalLayout: () => isVerticalLayout(),
            isHorizontalLayout: () => isHorizontalLayout(),
            isLandingPage,
            setIsLandingPage,
        }),
        [
            darkMode,
            isTransferMode,
            upcomingStationsVisible,
            upcomingStationsLayout,
            isLandingPage,
            setIsLandingPage,
        ]
    )

    return (
        <UIContext.Provider value={value}>{children}</UIContext.Provider>
        // <UIContext.Provider
        //     value={{
        //         isTransferMode,
        //         setIsTransferMode,
        //         darkMode,
        //         setDarkMode,
        //         upcomingStationsVisible,
        //         setUpcomingStationsVisible,
        //         upcomingStationsLayout,
        //         setUpcomingStationsLayout,
        //     }}
        // >
        //     {children}
        // </UIContext.Provider>
    )
}

export const useUIContext = () => {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error('useUIContext must be used within a UIProvider')
    }
    return context
}
