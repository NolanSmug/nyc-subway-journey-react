import ConductorModeUI from '../ui/ConductorModeUI'

import { useTrainContext } from '../../contexts/TrainContext'
import { useUIContext } from '../../contexts/UIContext'
import { GameMode, useSettingsContext } from '../../contexts/SettingsContext'

import { useUITheme } from '../../hooks/useCSSProperties'
import { useGame } from '../../hooks/useGame'
import useKeyShortcuts from '../../hooks/useKeyShortcuts'

function ConductorMode() {
    const { initializeGame } = useGame()
    const advanceStation = useTrainContext((state) => state.actions.advanceStation)
    const changeDirection = useTrainContext((state) => state.actions.changeDirection)

    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const darkMode = useSettingsContext((state) => state.darkMode)
    const setDarkMode = useSettingsContext((state) => state.setDarkMode)
    const setUpcomingStationsVisible = useSettingsContext((state) => state.setUpcomingStationsVisible)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const toggleUpcomingStationsLayout = useSettingsContext((state) => state.toggleUpcomingStationsLayout)
    const setNumAdvanceStations = useSettingsContext((state) => state.setNumAdvanceStations)
    const setGameMode = useSettingsContext((state) => state.setGameMode)

    useUITheme(darkMode)

    useKeyShortcuts({
        comboKeys: {
            'Shift+L': toggleUpcomingStationsLayout,
            'Shift+D': () => setDarkMode((prev: boolean) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev: boolean) => !prev),
            'Shift+C': () => setGameMode((prev) => (prev === GameMode.CONDUCTOR ? GameMode.RIDER : GameMode.CONDUCTOR)),
        },
        singleKeys: {
            t: () => setIsTransferMode((prev: boolean) => !prev),
            c: changeDirection,
            r: initializeGame,
            ArrowRight: () => advanceStation(numAdvanceStations),
            Escape: () => setIsTransferMode(false),
            '-': () => setNumAdvanceStations((prev: number) => Math.max(1, prev - 1)),
            '+': () => setNumAdvanceStations((prev: number) => prev + 1),
            '=': () => setNumAdvanceStations((prev: number) => prev + 1),
        },
    })

    return <ConductorModeUI />
}

export default ConductorMode
