import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'

interface UIContextProps {
    isTransferMode: boolean
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>
    forceRenderRefresh: () => void
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
    upcomingStationsVisible: boolean
    setUpcomingStationsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

// Provides values/state variables related to the user interface
export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [, forceRenderRefresh] = useState(false)
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(true)

    const triggerRenderRefresh = () => forceRenderRefresh((prev) => !prev)

    return (
        <UIContext.Provider
            value={{
                isTransferMode,
                setIsTransferMode,
                forceRenderRefresh: triggerRenderRefresh,
                darkMode,
                setDarkMode,
                upcomingStationsVisible,
                setUpcomingStationsVisible,
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
