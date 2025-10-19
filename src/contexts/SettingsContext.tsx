import React, { useState, ReactNode, useMemo } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'
import { Direction } from '../logic/LineManager'

export enum Gender {
    MALE,
    FEMALE,
    OTHER,
}

export enum GameMode {
    CONDUCTOR,
    RIDER,
}

interface SettingsContextProps {
    gameMode: GameMode
    setGameMode: React.Dispatch<React.SetStateAction<GameMode>>
    numAdvanceStations: number
    defaultDirectionToggle: Direction
    setNumAdvanceStations: React.Dispatch<React.SetStateAction<number>>
    setDefaultDirectionToggle: React.Dispatch<React.SetStateAction<Direction>>
    passengerGender: Gender
    setPassengerGender: React.Dispatch<React.SetStateAction<Gender>>
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.RIDER)
    const [numAdvanceStations, setNumAdvanceStations] = useState<number>(1)
    const [defaultDirectionToggle, setDefaultDirectionToggle] = useState<Direction>(Direction.NULL_DIRECTION)
    const [passengerGender, setPassengerGender] = useState<Gender>(Gender.MALE)

    const value = useMemo(
        () => ({
            gameMode,
            setGameMode,
            numAdvanceStations,
            setNumAdvanceStations,
            defaultDirectionToggle,
            setDefaultDirectionToggle,
            passengerGender,
            setPassengerGender,
        }),
        [gameMode, numAdvanceStations, defaultDirectionToggle, passengerGender]
    )

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// export const useSettingsContext = () => {
//     const context = useContext(SettingsContext)
//     if (context === undefined) {
//         throw new Error('useSettingsContext must be used within a UIProvider')
//     }
//     return context
// }

export const useSettingsContext = <T,>(selector: (state: SettingsContextProps) => T): T => {
    const context = useContextSelector(SettingsContext, (state) => {
        if (state === undefined) {
            throw new Error('useSettingsContext must be used within a SettingsProvider')
        }
        return selector(state)
    })

    return context
}
