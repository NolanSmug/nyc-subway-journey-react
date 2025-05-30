import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Direction } from '../logic/LineManager'

interface SettingsContextProps {
    conductorMode: boolean
    numAdvanceStations: number
    defaultDirectionToggle: Direction
    setConductorMode: React.Dispatch<React.SetStateAction<boolean>>
    setNumAdvanceStations: React.Dispatch<React.SetStateAction<number>>
    setDefaultDirectionToggle: React.Dispatch<React.SetStateAction<Direction>>
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [conductorMode, setConductorMode] = useState<boolean>(false)
    const [numAdvanceStations, setNumAdvanceStations] = useState<number>(NaN)
    const [defaultDirectionToggle, setDefaultDirectionToggle] = useState<Direction>(Direction.NULL_DIRECTION)

    return (
        <SettingsContext.Provider
            value={{
                conductorMode,
                setConductorMode,
                numAdvanceStations,
                setNumAdvanceStations,
                defaultDirectionToggle,
                setDefaultDirectionToggle,
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
