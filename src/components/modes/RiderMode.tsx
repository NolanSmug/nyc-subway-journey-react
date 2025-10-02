import { useEffect } from 'react'
import RiderModeUI from '../ui/RiderModeUI'

import { useTrainContext } from '../../contexts/TrainContext'
import { UpcomingStationsLayout, useUIContext } from '../../contexts/UIContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

import { useGame } from '../../hooks/useGame'
import { useUITheme } from '../../hooks/useCSSProperties'
import { PassengerState } from '../../hooks/usePassengerActions'
import useKeyShortcuts from '../../hooks/useKeyShortcuts'

function RiderMode() {
    const { initializeGame } = useGame()
    const { advanceStation, changeDirection } = useTrainContext((state) => state.actions)

    const darkMode = useUIContext((state) => state.darkMode)
    const passengerState = useUIContext((state) => state.passengerState)
    const setDarkMode = useUIContext((state) => state.setDarkMode)
    const setUpcomingStationsLayout = useUIContext((state) => state.setUpcomingStationsLayout)
    const setUpcomingStationsVisible = useUIContext((state) => state.setUpcomingStationsVisible)

    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const setConductorMode = useSettingsContext((state) => state.setConductorMode)

    useUITheme(darkMode)

    useKeyShortcuts({
        comboKeys: {
            'Shift+D': () => setDarkMode((prev) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev) => !prev),
            'Shift+C': () => setConductorMode((prev) => !prev),
        },
        singleKeys: {
            ArrowRight: () => advanceStation(numAdvanceStations),
            c: changeDirection,
            r: initializeGame,
        },
        enabled: passengerState != PassengerState.WALKING || process.env.REACT_APP_USE_DEV_API === 'true',
    })

    useEffect(() => {
        setUpcomingStationsLayout(UpcomingStationsLayout.HORIZONTAL)
    }, [setUpcomingStationsLayout])

    return <RiderModeUI />
}

export default RiderMode
