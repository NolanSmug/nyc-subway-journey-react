import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UIContextProps {
    darkMode: boolean
    isTransferMode: boolean
    // I would rather these two variables be represented by an enum
    //
    // 1. The location of the stations bar isn't a boolean, it's a choice from
    //    a known set of options. Horizontal isn't the opposite of vertical,
    //    something not being vertical doesn't imply that it's horizontal.
    //
    // 2. Later you might have another place you need to put it.
    //
    // 3. Not showing it is just another way of rendering it
    //
    // 4. It's possible to represent the status bar not being drawn in two 
    //    different locations this way
    //
    // If you were now showing the status bar because you're in a modal ui
    // where it isn't relevant, then "visible" might be ok. But in that case,
    // I would then prefer that it be inferred enum for the modes.
    //
    // The visibility of the stations thing semantically isn't something that
    // exists in isolation in your application. This structurally leads to
    // your settings menu having both "Upcoming stations" and "Upcoming stations layout"
    // which isn't obvious what they do. Horizontal, Vertical and Hidden are 
    // 3 options you have for the display location of the line and they should
    // be displayed in a way that communicates that relationship in your settings menu.
    // A tri-modal button maybe?
    //
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

// literally the only point of a context in this framework is to be used by the ui
// That being said I don't have a better name and the grouped state is very logical
//
export const useUIContext = () => {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error('useUIContext must be used within a UIProvider')
    }
    return context
}
