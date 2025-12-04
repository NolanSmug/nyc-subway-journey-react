import React, { useCallback } from 'react'
import ConductorModeUI from '../ui/ConductorModeUI'

import { useTrainContext } from '../../contexts/TrainContext'
import { useUIContext } from '../../contexts/UIContext'
import { GameMode, UpcomingStationsLayout, useSettingsContext } from '../../contexts/SettingsContext'
import { useGameStateContext } from '../../contexts/GameStateContext'

import { useUITheme } from '../../hooks/useCSSProperties'
import { useGame } from '../../hooks/useGame'
import useKeyShortcuts from '../../hooks/useKeyShortcuts'

import { Station as StationObject } from '../../logic/StationManager'
import { Direction } from '../../logic/LineManager'

function ConductorMode() {
    const { gameState } = useGameStateContext()
    const { initializeGame } = useGame()

    const { advanceStation, transfer, changeDirection } = useTrainContext((state) => state.actions)
    const currentStation: StationObject = useTrainContext((state) => state.train.getCurrentStation())
    const currentDirection: Direction = useTrainContext((state) => state.train.getDirection())

    const darkMode = useSettingsContext((state) => state.darkMode)
    const isVerticalLayout = useSettingsContext((state) => state.upcomingStationsLayout === UpcomingStationsLayout.VERTICAL)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const setDarkMode = useSettingsContext((state) => state.setDarkMode)
    const setUpcomingStationsVisible = useSettingsContext((state) => state.setUpcomingStationsVisible)
    const toggleUpcomingStationsLayout = useSettingsContext((state) => state.toggleUpcomingStationsLayout)
    const setNumAdvanceStations = useSettingsContext((state) => state.setNumAdvanceStations)
    const setGameMode = useSettingsContext((state) => state.setGameMode)

    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const handleLineClick = useCallback(
        (index: number) => {
            setIsTransferMode(false)
            transfer(index)
        },
        [setIsTransferMode, transfer]
    )

    const handleTransferClick = useCallback(() => {
        setIsTransferMode((prev) => !prev)
    }, [setIsTransferMode])

    const handleAdvanceClick = useCallback(() => {
        setIsTransferMode(false)
        advanceStation(numAdvanceStations)
    }, [setIsTransferMode, advanceStation, numAdvanceStations])

    const handleChangeDirectionClick = useCallback(
        (direction?: Direction) => {
            setIsTransferMode(false)
            changeDirection(direction)
        },
        [setIsTransferMode, changeDirection]
    )

    const handleResetClick = useCallback(() => {
        setIsTransferMode(false)
        initializeGame()
    }, [setIsTransferMode, initializeGame])

    useKeyShortcuts({
        comboKeys: {
            'Shift+L': toggleUpcomingStationsLayout,
            'Shift+D': () => setDarkMode((prev: boolean) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev: boolean) => !prev),
            'Shift+C': () => {
                setGameMode(GameMode.RIDER)
                changeDirection(Direction.NULL_DIRECTION) // passenger mounts on CENTER_PLATFORM
            },
        },
        singleKeys: {
            t: handleTransferClick,
            u: () => handleChangeDirectionClick(Direction.UPTOWN),
            d: () => handleChangeDirectionClick(Direction.DOWNTOWN),
            c: () => handleChangeDirectionClick(),
            r: handleResetClick,
            ArrowRight: handleAdvanceClick,
            Escape: () => setIsTransferMode(false),
            '-': () => setNumAdvanceStations((prev: number) => Math.max(1, prev - 1)),
            '+': () => setNumAdvanceStations((prev: number) => prev + 1),
            '=': () => setNumAdvanceStations((prev: number) => prev + 1),
        },
    })

    useUITheme(darkMode)

    return (
        <ConductorModeUI
            gameState={gameState}
            currentStation={currentStation}
            direction={currentDirection}
            darkMode={darkMode}
            numAdvanceStations={numAdvanceStations}
            handleLineClick={handleLineClick}
            handleTransferClick={handleTransferClick}
            handleAdvanceClick={handleAdvanceClick}
            handleChangeDirectionClick={handleChangeDirectionClick}
            handleResetClick={handleResetClick}
            isVerticalLayout={isVerticalLayout}
        />
    )
}

export default ConductorMode
