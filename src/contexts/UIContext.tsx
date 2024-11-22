import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UIContextProps {
    darkMode: boolean
    advancedMode: boolean
    isTransferMode: boolean
    upcomingStationsVisible: boolean
    upcomingStationsVertical: boolean
    numAdvanceStations: number
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
    setAdvancedMode: React.Dispatch<React.SetStateAction<boolean>>
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingStationsVisible: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingStationsVertical: React.Dispatch<React.SetStateAction<boolean>>
    setNumAdvanceStations: React.Dispatch<React.SetStateAction<number>>
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

// Provides values/state variables related to the user interface
export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [advancedMode, setAdvancedMode] = useState<boolean>(false)
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(true)
    const [upcomingStationsVertical, setUpcomingStationsVertical] = useState<boolean>(true)
    const [numAdvanceStations, setNumAdvanceStations] = useState<number>(1)

    return (
        <UIContext.Provider
            value={{
                isTransferMode,
                setIsTransferMode,
                darkMode,
                setDarkMode,
                advancedMode,
                setAdvancedMode,
                upcomingStationsVisible,
                setUpcomingStationsVisible,
                upcomingStationsVertical,
                setUpcomingStationsVertical,
                setNumAdvanceStations,
                numAdvanceStations,
            }}
        >
            {children}
        </UIContext.Provider>
    )
}

export const useUIContext = () => {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error('useUIContext must be used within a UIProvider')
    }
    return context
}
