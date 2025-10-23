import { useCallback, useEffect, useRef } from 'react'
import RiderModeUI from '../ui/RiderModeUI'

import { useTrainContext } from '../../contexts/TrainContext'
import { UpcomingStationsLayout, useUIContext } from '../../contexts/UIContext'
import { GameMode, useSettingsContext } from '../../contexts/SettingsContext'

import { Direction } from '../../logic/LineManager'
import { useGame } from '../../hooks/useGame'
import { useUITheme } from '../../hooks/useCSSProperties'
import useKeyShortcuts from '../../hooks/useKeyShortcuts'
import usePassengerActions, { PassengerAction, PassengerState } from '../../hooks/usePassengerActions'

function RiderMode() {
    const { initializeGame } = useGame()
    const advanceStation = useTrainContext((state) => state.actions.advanceStation)
    const changeDirection = useTrainContext((state) => state.actions.changeDirection) // ? Is it better to separate these?

    const darkMode = useUIContext((state) => state.darkMode)
    const passengerState = useUIContext((state) => state.passengerState)
    const setDarkMode = useUIContext((state) => state.setDarkMode)
    const setUpcomingStationsLayout = useUIContext((state) => state.setUpcomingStationsLayout)
    const setUpcomingStationsVisible = useUIContext((state) => state.setUpcomingStationsVisible)
    const setPassengerState = useUIContext((state) => state.setPassengerState)
    const setPassengerPosition = useUIContext((state) => state.setPassengerPosition)

    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const setGameMode = useSettingsContext((state) => state.setGameMode)

    useUITheme(darkMode)
    const { walkPassenger } = usePassengerActions({ passengerState, setPassengerPosition, setPassengerState })
    const uptownTrainDoorRef = useRef<HTMLDivElement>(null)
    const downtownTrainDoorRef = useRef<HTMLDivElement>(null)

    // User actions that update the train AND passenger states
    const handleBoardUptown = useCallback(() => {
        if (uptownTrainDoorRef.current) {
            walkPassenger(PassengerAction.BOARD_TRAIN, PassengerState.UPTOWN_TRAIN, uptownTrainDoorRef.current)
        }
        changeDirection(Direction.UPTOWN)
    }, [walkPassenger, changeDirection, passengerState])
    const handleBoardDowntown = useCallback(() => {
        if (downtownTrainDoorRef.current) {
            walkPassenger(PassengerAction.BOARD_TRAIN, PassengerState.DOWNTOWN_TRAIN, downtownTrainDoorRef.current)
        }
        changeDirection(Direction.DOWNTOWN)
    }, [walkPassenger, changeDirection, passengerState])
    const handleDeboard = useCallback(() => {
        walkPassenger(PassengerAction.DEBOARD_TRAIN, PassengerState.TRANSFER_PLATFORM)
        changeDirection(Direction.NULL_DIRECTION)
    }, [walkPassenger, changeDirection, passengerState])

    useKeyShortcuts({
        comboKeys: {
            'Shift+D': () => setDarkMode((prev) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev) => !prev),
            'Shift+C': () => setGameMode((prev) => (prev === GameMode.CONDUCTOR ? GameMode.RIDER : GameMode.CONDUCTOR)),
        },
        singleKeys: {
            ArrowRight: () => advanceStation(numAdvanceStations),
            u: handleBoardUptown,
            d: handleBoardDowntown,
            t: handleDeboard,
            c: process.env.REACT_APP_USE_DEV_API === 'true' ? changeDirection : () => {},
            r: initializeGame,
        },
        enabled: passengerState != PassengerState.WALKING || process.env.REACT_APP_USE_DEV_API === 'true',
    })

    useEffect(() => {
        setUpcomingStationsLayout(UpcomingStationsLayout.HORIZONTAL) // vertical layout not (yet) supported in rider mode
    }, [setUpcomingStationsLayout])

    return (
        <RiderModeUI
            handleBoardUptown={handleBoardUptown}
            handleBoardDowntown={handleBoardDowntown}
            handleDeboard={handleDeboard}
            uptownTrainDoorRef={uptownTrainDoorRef}
            downtownTrainDoorRef={downtownTrainDoorRef}
        />
    )
}

export default RiderMode
