import { useState, ReactNode, useMemo, useCallback } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'

export enum GameMode {
    CLASSIC,
    OPEN,
    DAILY_CHALLENGE,
    // NEW_YORKER
}

export enum UIMode {
    CONDUCTOR = 'conductor',
    RIDER = 'rider',
}

export enum UpcomingStationsLayout {
    HORIZONTAL,
    VERTICAL,
}

export enum Gender {
    MALE,
    FEMALE,
    OTHER,
}

interface SettingsContextProps {
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>

    uiMode: UIMode
    setUIMode: React.Dispatch<React.SetStateAction<UIMode>>

    upcomingStationsVisible: boolean
    setUpcomingStationsVisible: React.Dispatch<React.SetStateAction<boolean>>

    upcomingStationsLayout: UpcomingStationsLayout
    setUpcomingStationsLayout: React.Dispatch<React.SetStateAction<UpcomingStationsLayout>>
    toggleUpcomingStationsLayout: () => void

    numAdvanceStations: number
    setNumAdvanceStations: React.Dispatch<React.SetStateAction<number>>
    passengerGender: Gender
    setPassengerGender: React.Dispatch<React.SetStateAction<Gender>>
    gameMode: GameMode
    setGameMode: React.Dispatch<React.SetStateAction<GameMode>>
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.OPEN)
    const [uiMode, setUIMode] = useState<UIMode>(UIMode.RIDER)
    const [upcomingStationsVisible, setUpcomingStationsVisible] = useState<boolean>(true)
    const [numAdvanceStations, setNumAdvanceStations] = useState<number>(1)
    const [passengerGender, setPassengerGender] = useState<Gender>(Gender.MALE)
    const [upcomingStationsLayout, setUpcomingStationsLayout] = useState<UpcomingStationsLayout>(UpcomingStationsLayout.HORIZONTAL)

    const toggleUpcomingStationsLayout = useCallback(() => {
        if (!upcomingStationsVisible) return
        setUpcomingStationsLayout((prev) =>
            prev === UpcomingStationsLayout.HORIZONTAL ? UpcomingStationsLayout.VERTICAL : UpcomingStationsLayout.HORIZONTAL
        )
    }, [upcomingStationsVisible])

    const value = useMemo(
        () => ({
            darkMode,
            setDarkMode,

            upcomingStationsVisible,
            setUpcomingStationsVisible,
            upcomingStationsLayout,
            setUpcomingStationsLayout,
            toggleUpcomingStationsLayout,

            uiMode,
            setUIMode,
            numAdvanceStations,
            setNumAdvanceStations,
            passengerGender,
            setPassengerGender,
            gameMode,
            setGameMode,
        }),
        [
            darkMode,
            uiMode,
            upcomingStationsVisible,
            upcomingStationsLayout,
            toggleUpcomingStationsLayout,
            numAdvanceStations,
            passengerGender,
            gameMode,
        ]
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
