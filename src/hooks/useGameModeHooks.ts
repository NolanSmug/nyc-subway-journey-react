import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useUIContext } from '../contexts/UIContext'

import { useUITheme } from './useCSSProperties'
import { PassengerState } from './usePassengerActions'
import useTrainActions from './useTrainActions'

export function useGameModeHooks() {
    const {
        darkMode,
        setDarkMode,
        setUpcomingStationsVisible,
        setUpcomingStationsLayout,
        toggleUpcomingStationsLayout,
        setIsTransferMode,
        passengerState,
    } = useUIContext()
    const { numAdvanceStations, setConductorMode, setNumAdvanceStations, conductorMode } = useSettingsContext()
    const { train, updateTrainObject, setGameState, gameState, initializeGame } = useGameContext()

    const actions = useTrainActions({
        train,
        gameState,
        conductorMode,
        updateTrainObject,
        setGameState,
        passengerIsWalking: conductorMode && passengerState === PassengerState.WALKING,
    })

    useUITheme(darkMode)

    return {
        ui: {
            darkMode,
            setDarkMode,
            setUpcomingStationsVisible,
            setUpcomingStationsLayout,
            toggleUpcomingStationsLayout,
            setIsTransferMode,
            passengerState,
        },
        settings: { numAdvanceStations, conductorMode, setConductorMode, setNumAdvanceStations },
        game: { train, gameState, initializeGame },
        actions,
    }
}
