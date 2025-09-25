import { useCallback, useEffect } from 'react'
import RiderModeUI from '../ui/RiderModeUI'

import useKeyShortcuts from '../../hooks/useKeyShortcuts'
import { PassengerState } from '../../hooks/usePassengerActions'
import { useGameModeHooks } from '../../hooks/useGameModeHooks'
import { UpcomingStationsLayout } from '../../contexts/UIContext'

function RiderMode() {
    const { ui, settings, game, actions } = useGameModeHooks()

    const resetGame = useCallback(async () => await game.initializeGame(), [game.gameState.destinationStation])

    useKeyShortcuts({
        comboKeys: {
            'Shift+D': () => ui.setDarkMode((prev) => !prev),
            'Shift+U': () => ui.setUpcomingStationsVisible((prev) => !prev),
            'Shift+C': () => settings.setConductorMode((prev) => !prev),
        },
        singleKeys: {
            c: actions.changeDirection,
            r: resetGame,
            ArrowRight: () => actions.advanceStation(settings.numAdvanceStations),
        },
        enabled: ui.passengerState != PassengerState.WALKING || process.env.REACT_APP_USE_DEV_API === 'true',
    })

    useEffect(() => {
        ui.setUpcomingStationsLayout(UpcomingStationsLayout.HORIZONTAL)
    }, [ui.setUpcomingStationsLayout])

    return (
        <RiderModeUI
            train={game.train}
            gameState={game.gameState}
            advanceStation={actions.advanceStation}
            transfer={actions.transfer}
            changeDirection={actions.changeDirection}
        />
    )
}

export default RiderMode
