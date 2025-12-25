import React, { useState, ReactNode, useMemo, useCallback } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'

export enum UpcomingStationsLayout {
    HORIZONTAL,
    VERTICAL,
}

export enum GameMode {
    CONDUCTOR,
    RIDER,
}

export enum GameDifficulty {
    NORMAL,
    NEW_YORKER,
}

export enum Gender {
    MALE,
    FEMALE,
    OTHER,
}

interface SettingsContextProps {
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>

    gameMode: GameMode
    setGameMode: React.Dispatch<React.SetStateAction<GameMode>>

    gameDifficulty: GameDifficulty
    setGameDifficulty: React.Dispatch<React.SetStateAction<GameDifficulty>>

    upcomingStationsVisible: boolean
    setUpcomingStationsVisible: React.Dispatch<React.SetStateAction<boolean>>

    upcomingStationsLayout: UpcomingStationsLayout
    setUpcomingStationsLayout: React.Dispatch<React.SetStateAction<UpcomingStationsLayout>>
    toggleUpcomingStationsLayout: () => void

    numAdvanceStations: number
    setNumAdvanceStations: React.Dispatch<React.SetStateAction<number>>
    passengerGender: Gender
    setPassengerGender: React.Dispatch<React.SetStateAction<Gender>>
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(true)
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.RIDER)
    const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>(GameDifficulty.NEW_YORKER) // ! TESTING ONLY: change to NORMAL
    const [numAdvanceStations, setNumAdvanceStations] = useState<number>(1)
    const [passengerGender, setPassengerGender] = useState<Gender>(Gender.MALE)
    const [upcomingStationsLayout, setUpcomingStationsLayout] = useState<UpcomingStationsLayout>(UpcomingStationsLayout.HORIZONTAL)

    const toggleUpcomingStationsLayout = useCallback(() => {
        setUpcomingStationsLayout(
            upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL
                ? UpcomingStationsLayout.VERTICAL
                : UpcomingStationsLayout.HORIZONTAL
        )
    }, [upcomingStationsLayout])

    const value = useMemo(
        () => ({
            darkMode,
            setDarkMode,

            upcomingStationsVisible,
            setUpcomingStationsVisible,
            upcomingStationsLayout,
            setUpcomingStationsLayout,
            toggleUpcomingStationsLayout,

            gameDifficulty,
            setGameDifficulty,
            gameMode,
            setGameMode,
            numAdvanceStations,
            setNumAdvanceStations,
            passengerGender,
            setPassengerGender,
        }),
        [darkMode, gameMode, gameDifficulty, upcomingStationsVisible, upcomingStationsLayout, numAdvanceStations, passengerGender]
    )

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettingsContext = <T,>(selector: (state: SettingsContextProps) => T): T => {
    const context = useContextSelector(SettingsContext, (state) => {
        if (state === undefined) {
            throw new Error('useSettingsContext must be used within a SettingsProvider')
        }
        return selector(state)
    })

    return context
}
