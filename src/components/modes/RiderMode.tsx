import RiderModeUI from '../ui/RiderModeUI'
import { useCallback, useEffect, useRef, useState } from 'react'

import Passenger from '../Passenger'

import { useTrainContext } from '../../contexts/TrainContext'
import { GameMode, UpcomingStationsLayout, useSettingsContext } from '../../contexts/SettingsContext'

import { useGame } from '../../hooks/useGame'
import { useUITheme } from '../../hooks/useCSSProperties'
import useKeyShortcuts from '../../hooks/useKeyShortcuts'
import usePassengerActions, {
    CENTER_PLATFORM_POS,
    PassengerAction,
    PassengerPosition,
    PassengerState,
} from '../../hooks/usePassengerActions'

import { Direction, LineName } from '../../logic/LineManager'

function RiderMode() {
    const { initializeGame } = useGame()

    const darkMode = useSettingsContext((state) => state.darkMode)
    const setDarkMode = useSettingsContext((state) => state.setDarkMode)
    const setUpcomingStationsVisible = useSettingsContext((state) => state.setUpcomingStationsVisible)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const setUpcomingStationsLayout = useSettingsContext((state) => state.setUpcomingStationsLayout)
    const setGameMode = useSettingsContext((state) => state.setGameMode)

    const [passengerPosition, setPassengerPosition] = useState<PassengerPosition>(CENTER_PLATFORM_POS)
    const [passengerState, setPassengerState] = useState<PassengerState>(PassengerState.CENTER_PLATFORM)

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)

    const { advanceStation, transfer, changeDirection } = useTrainContext((state) => state.actions)
    const { walkPassenger } = usePassengerActions({ passengerState, setPassengerPosition, setPassengerState })

    const uptownTrainDoorRef = useRef<HTMLDivElement>(null)
    const downtownTrainDoorRef = useRef<HTMLDivElement>(null)

    const selectStaircaseLine = useCallback(
        (index: number, line?: LineName): void => {
            if (passengerState !== PassengerState.TRANSFER_PLATFORM) return
            setSelectedGroupIndex(index)

            if (inTransferTunnel && line) {
                transfer(line)
                setTimeout(() => setInTransferTunnel(false), 25)
                changeDirection(Direction.NULL_DIRECTION)
            } else {
                setInTransferTunnel(true)
            }
        },
        [passengerState, inTransferTunnel, transfer, changeDirection]
    )

    const handleBoardUptown = useCallback(() => {
        if (uptownTrainDoorRef.current) {
            walkPassenger(PassengerAction.BOARD_TRAIN, PassengerState.UPTOWN_TRAIN, uptownTrainDoorRef.current)
        }
        changeDirection(Direction.UPTOWN)
    }, [walkPassenger, changeDirection])

    const handleBoardDowntown = useCallback(() => {
        if (downtownTrainDoorRef.current) {
            walkPassenger(PassengerAction.BOARD_TRAIN, PassengerState.DOWNTOWN_TRAIN, downtownTrainDoorRef.current)
        }
        changeDirection(Direction.DOWNTOWN)
    }, [walkPassenger, changeDirection])

    const handleDeboard = useCallback(() => {
        walkPassenger(PassengerAction.DEBOARD_TRAIN, PassengerState.TRANSFER_PLATFORM)
        changeDirection(Direction.NULL_DIRECTION)
    }, [walkPassenger, changeDirection])

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
            r: initializeGame,
        },
        enabled: passengerState !== PassengerState.WALKING || process.env.REACT_APP_USE_DEV_API === 'true',
    })

    useUITheme(darkMode)
    useEffect(() => {
        setUpcomingStationsLayout(UpcomingStationsLayout.HORIZONTAL)
    }, [setUpcomingStationsLayout])

    return (
        <RiderModeUI
            handleBoardUptown={handleBoardUptown}
            handleBoardDowntown={handleBoardDowntown}
            handleDeboard={handleDeboard}
            selectStaircaseLine={selectStaircaseLine}
            advanceStation={advanceStation}
            transfer={transfer}
            uptownTrainDoorRef={uptownTrainDoorRef}
            downtownTrainDoorRef={downtownTrainDoorRef}
            passengerState={passengerState}
            inTransferTunnel={inTransferTunnel}
            selectedGroupIndex={selectedGroupIndex}
        >
            <Passenger passengerState={passengerState} passengerPosition={passengerPosition} />
        </RiderModeUI>
    )
}

export default RiderMode
