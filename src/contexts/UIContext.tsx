import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UIContextProps {
    darkMode: boolean

    isTransferMode: boolean
    upcomingStationsVisible: boolean
    upcomingStationsVertical: boolean

    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>

    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingStationsVisible: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingStationsVertical: React.Dispatch<React.SetStateAction<boolean>>
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

// Provides values/state variables related to the user interface
export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(false)
    const [upcomingStationsVertical, setUpcomingStationsVertical] = useState<boolean>(true)

    return (
        <UIContext.Provider
            value={{
                isTransferMode,
                setIsTransferMode,
                darkMode,
                setDarkMode,
                upcomingStationsVisible,
                setUpcomingStationsVisible,
                upcomingStationsVertical,
                setUpcomingStationsVertical,
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
