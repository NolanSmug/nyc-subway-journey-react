import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Direction } from '../logic/LineManager'

export enum Gender {
    MALE,
    FEMALE,
    OTHER,
}

interface SettingsContextProps {
    conductorMode: boolean
    numAdvanceStations: number
    defaultDirectionToggle: Direction
    setConductorMode: React.Dispatch<React.SetStateAction<boolean>>
    setNumAdvanceStations: React.Dispatch<React.SetStateAction<number>>
    setDefaultDirectionToggle: React.Dispatch<React.SetStateAction<Direction>>
    passengerGender: Gender
    setPassengerGender: React.Dispatch<React.SetStateAction<Gender>>
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [conductorMode, setConductorMode] = useState<boolean>(false)
    const [numAdvanceStations, setNumAdvanceStations] = useState<number>(1)
    const [defaultDirectionToggle, setDefaultDirectionToggle] = useState<Direction>(Direction.NULL_DIRECTION)
    const [passengerGender, setPassengerGender] = useState<Gender>(Gender.MALE)

    return (
        <SettingsContext.Provider
            value={{
                conductorMode,
                setConductorMode,
                numAdvanceStations,
                setNumAdvanceStations,
                defaultDirectionToggle,
                setDefaultDirectionToggle,
                passengerGender,
                setPassengerGender,
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
