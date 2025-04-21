import React, { createContext, useContext, useState, ReactNode, useMemo } from "react"

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
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(true)
    const [upcomingStationsVertical, setUpcomingStationsVertical] = useState<boolean>(false)

    const value = useMemo(
        () => ({
            darkMode,
            isTransferMode,
            upcomingStationsVisible,
            upcomingStationsVertical,
            setDarkMode,
            setIsTransferMode,
            setUpcomingStationsVisible,
            setUpcomingStationsVertical,
            toggleDarkMode: () => setDarkMode((prev) => !prev),
            toggleTransferMode: () => setIsTransferMode((prev) => !prev),
            toggleUpcomingStationsVisible: () => setUpcomingStationsVisible((prev) => !prev),
            toggleUpcomingStationsVertical: () => setUpcomingStationsVertical((prev) => !prev),
        }),
        [darkMode, isTransferMode, upcomingStationsVisible, upcomingStationsVertical]
    )


    return (
        <UIContext.Provider
            value={value}
        >
            {children}
        </UIContext.Provider>
        // <UIContext.Provider
        //     value={{
        //         isTransferMode,
        //         setIsTransferMode,
        //         darkMode,
        //         setDarkMode,
        //         upcomingStationsVisible,
        //         setUpcomingStationsVisible,
        //         upcomingStationsVertical,
        //         setUpcomingStationsVertical,
        //     }}
        // >
        //     {children}
        // </UIContext.Provider>

    )
}

export const useUIContext = () => {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error("useUIContext must be used within a UIProvider")
    }
    return context
}
