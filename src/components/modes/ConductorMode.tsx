import { useCallback } from 'react'
import ConductorModeUI from '../ui/ConductorModeUI'

import useKeyShortcuts from '../../hooks/useKeyShortcuts'
import { useGameModeHooks } from '../../hooks/useGameModeHooks'

function ConductorMode() {
    const { ui, settings, game, actions } = useGameModeHooks()

    const resetGame = useCallback(async () => await game.initializeGame(), [game.gameState.destinationStation])

    useKeyShortcuts({
        comboKeys: {
            'Shift+L': ui.toggleUpcomingStationsLayout,
            'Shift+D': () => ui.setDarkMode((prev: boolean) => !prev),
            'Shift+U': () => ui.setUpcomingStationsVisible((prev: boolean) => !prev),
            'Shift+C': () => settings.setConductorMode((prev: boolean) => !prev),
        },
        singleKeys: {
            t: () => ui.setIsTransferMode((prev: boolean) => !prev),
            c: actions.changeDirection,
            r: resetGame,
            ArrowRight: () => actions.advanceStation(settings.numAdvanceStations),
            Escape: () => ui.setIsTransferMode(false),
            '-': () => settings.setNumAdvanceStations((prev: number) => Math.max(1, prev - 1)),
            '+': () => settings.setNumAdvanceStations((prev: number) => prev + 1),
            '=': () => settings.setNumAdvanceStations((prev: number) => prev + 1),
        },
    })

    return (
        <ConductorModeUI
            train={game.train}
            gameState={game.gameState}
            conductorMode={settings.conductorMode}
            darkMode={ui.darkMode}
            numAdvanceStations={settings.numAdvanceStations}
            advanceStation={actions.advanceStation}
            transfer={actions.transfer}
            changeDirection={actions.changeDirection}
            resetGame={resetGame}
            setIsTransferMode={ui.setIsTransferMode}
        />
    )
}

export default ConductorMode
