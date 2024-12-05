import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SettingsContextProps {
    conductorMode: boolean
    numAdvanceStations: number
    setConductorMode: React.Dispatch<React.SetStateAction<boolean>>
    setNumAdvanceStations: React.Dispatch<React.SetStateAction<number>>
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [conductorMode, setConductorMode] = useState<boolean>(false)
    const [numAdvanceStations, setNumAdvanceStations] = useState<number>(NaN)

    return (
        <SettingsContext.Provider
            value={{
                conductorMode,
                setConductorMode,
                numAdvanceStations,
                setNumAdvanceStations,
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettingsContext = () => {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a UIProvider')
    }
    return context
}
