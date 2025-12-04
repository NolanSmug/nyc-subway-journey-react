import RiderModeUI from '../ui/RiderModeUI'
import { useCallback, useEffect, useRef, useState } from 'react'

import Passenger from '../Passenger'

import { useTrainContext } from '../../contexts/TrainContext'
import { useUIContext } from '../../contexts/UIContext'
import { GameMode, UpcomingStationsLayout, useSettingsContext } from '../../contexts/SettingsContext'

import { useGame } from '../../hooks/useGame'
import { useUITheme } from '../../hooks/useCSSProperties'
import { usePassenger } from '../../hooks/usePassenger'
import { PassengerState } from '../../hooks/usePassenger'
import useKeyShortcuts from '../../hooks/useKeyShortcuts'

import { Direction, LineName } from '../../logic/LineManager'

function RiderMode() {
    const passenger = usePassenger()

    const { initializeGame } = useGame()
    const { advanceStation, transfer, changeDirection } = useTrainContext((state) => state.actions)

    const darkMode = useSettingsContext((state) => state.darkMode)
    const setDarkMode = useSettingsContext((state) => state.setDarkMode)
    const setUpcomingStationsVisible = useSettingsContext((state) => state.setUpcomingStationsVisible)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const setUpcomingStationsLayout = useSettingsContext((state) => state.setUpcomingStationsLayout)
    const setGameMode = useSettingsContext((state) => state.setGameMode)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)
    const [isPassengerTransferring, setIsPassengerTransferring] = useState<boolean>(false)

    const uptownTrainDoorRef = useRef<HTMLDivElement>(null)
    const downtownTrainDoorRef = useRef<HTMLDivElement>(null)
    const staircaseRefs = useRef<(HTMLDivElement | null)[]>([])

    const resetStates = useCallback(() => {
        setInTransferTunnel(false)
        setIsPassengerTransferring(false)
        setSelectedGroupIndex(-1)
    }, [setInTransferTunnel, setIsPassengerTransferring, setSelectedGroupIndex])

    const resetGame = useCallback(() => {
        initializeGame()

        passenger.resetState()
        resetStates()
    }, [passenger, resetStates, initializeGame])

    const animatePassengerDownStairs = useCallback(
        async (index: number) => {
            const targetStaircase = staircaseRefs.current[index]

            if (!targetStaircase) {
                console.error('Target staircase ref is missing for index:', index)
                return
            }

            await passenger.transferDownStairs(targetStaircase)
        },
        [passenger]
    )

    const animatePassengerUpStairs = useCallback(async () => {
        setIsPassengerTransferring(true)
        await passenger.transferUpStairs()
    }, [passenger])

    const handleBoardUptown = useCallback(async () => {
        if (passenger.passengerState === PassengerState.UPTOWN_TRAIN) return

        if (uptownTrainDoorRef.current) {
            await passenger.boardTrain(uptownTrainDoorRef.current, Direction.UPTOWN)
        }
        changeDirection(Direction.UPTOWN)
    }, [passenger, changeDirection])

    const handleBoardDowntown = useCallback(async () => {
        if (passenger.passengerState === PassengerState.DOWNTOWN_TRAIN) return

        if (downtownTrainDoorRef.current) {
            await passenger.boardTrain(downtownTrainDoorRef.current, Direction.DOWNTOWN)
        }
        changeDirection(Direction.DOWNTOWN)
    }, [passenger, changeDirection])

    const handleDeboard = useCallback(async () => {
        await passenger.deboard()
        changeDirection(Direction.NULL_DIRECTION)
    }, [passenger, changeDirection])

    const handleTransferSelect = useCallback(
        async (line: LineName) => {
            if (!inTransferTunnel || !line) return

            setIsTransferMode(false)
            await animatePassengerUpStairs()

            transfer(line)
            resetStates()
            handleDeboard() // passenger goes back to transfer platform after completing transfer
        },
        [inTransferTunnel, transfer, animatePassengerUpStairs, resetStates, handleDeboard]
    )

    const handleStaircaseSelect = useCallback(
        async (staircaseIndex: number) => {
            if (staircaseIndex === undefined || staircaseIndex === null) return

            setSelectedGroupIndex(staircaseIndex)
            await animatePassengerDownStairs(staircaseIndex)

            setInTransferTunnel(true)
        },
        [setInTransferTunnel, animatePassengerDownStairs]
    )

    const handleStaircaseDeselect = useCallback(() => {
        handleDeboard()
        resetStates()
    }, [resetStates, handleDeboard])

    useKeyShortcuts({
        comboKeys: {
            'Shift+D': () => setDarkMode((prev) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev) => !prev),
            'Shift+C': () => setGameMode(GameMode.CONDUCTOR),
        },
        singleKeys: {
            ArrowRight: () => advanceStation(numAdvanceStations),
            u: handleBoardUptown,
            d: handleBoardDowntown,
            t: handleDeboard,
            c: () => {
                changeDirection() === Direction.UPTOWN ? handleBoardUptown() : handleBoardDowntown()
            },
            r: () => resetGame(),
            Escape: () => inTransferTunnel && handleStaircaseDeselect(),
        },
        enabled: passenger.passengerState !== PassengerState.WALKING || process.env.REACT_APP_USE_DEV_API === 'true', // don't allow shortcuts when passenger is in motion (except in dev mode)
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
            onStaircaseSelect={handleStaircaseSelect}
            onStaircaseDeselect={handleStaircaseDeselect}
            onTransferSelect={handleTransferSelect}
            uptownTrainDoorRef={uptownTrainDoorRef}
            downtownTrainDoorRef={downtownTrainDoorRef}
            staircaseRefs={staircaseRefs}
            passengerState={passenger.passengerState}
            inTransferTunnel={inTransferTunnel}
            isPassengerTransferring={isPassengerTransferring}
            selectedGroupIndex={selectedGroupIndex}
        >
            <Passenger ref={passenger.ref} passengerState={passenger.passengerState} />
        </RiderModeUI>
    )
}

export default RiderMode
