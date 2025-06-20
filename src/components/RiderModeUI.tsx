import PassengerPlatformView from '../PassengerPlatformView'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'

import useTrainActions from '../hooks/useTrainActions'
import useKeyShortcuts from '../hooks/useKeyShortcuts'
import setUITheme from '../hooks/setUITheme'

function RiderModeUI() {
    const { darkMode, setIsTransferMode, setUpcomingStationsVisible, setDarkMode } = useUIContext()
    const { numAdvanceStations, conductorMode, setConductorMode } = useSettingsContext()
    const { train, updateTrainObject, setGameState, gameState, initializeGame } = useGameContext()

    const { advanceStation, changeDirection } = useTrainActions({
        train,
        gameState,
        numAdvanceStations,
        conductorMode,
        setIsTransferMode,
        updateTrainObject,
        setGameState,
    })

    const refreshGameAction = async () => {
        await initializeGame()
    }

    useKeyShortcuts({
        comboKeys: {
            'Shift+D': () => setDarkMode((prev) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev) => !prev),
            'Shift+C': () => setConductorMode((prev) => !prev),
        },
        singleKeys: {
            c: changeDirection,
            r: refreshGameAction,
            ArrowRight: advanceStation,
        },
    })

    setUITheme(darkMode)

    return <PassengerPlatformView />
}

export default RiderModeUI
