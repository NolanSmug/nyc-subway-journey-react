import React, { useCallback } from 'react'
import ConductorModeUI from '../ui/ConductorModeUI'

import { useTrainContext } from '../../contexts/TrainContext'
import { useUIContext } from '../../contexts/UIContext'
import { GameMode, useSettingsContext } from '../../contexts/SettingsContext'
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
    const isNullDirection: boolean = useTrainContext((state) => state.train.getDirection()) === Direction.NULL_DIRECTION

    const darkMode = useSettingsContext((state) => state.darkMode)
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

    const handleChangeDirectionClick = useCallback(() => {
        setIsTransferMode(false)
        changeDirection()
    }, [setIsTransferMode, changeDirection])

    const handleResetClick = useCallback(() => {
        setIsTransferMode(false)
        initializeGame()
    }, [setIsTransferMode, initializeGame])

    useKeyShortcuts({
        comboKeys: {
            'Shift+L': toggleUpcomingStationsLayout,
            'Shift+D': () => setDarkMode((prev: boolean) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev: boolean) => !prev),
            'Shift+C': () => setGameMode((prev) => (prev === GameMode.CONDUCTOR ? GameMode.RIDER : GameMode.CONDUCTOR)),
        },
        singleKeys: {
            t: handleTransferClick,
            c: handleChangeDirectionClick,
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
            isNullDirection={isNullDirection}
            darkMode={darkMode}
            numAdvanceStations={numAdvanceStations}
            handleLineClick={handleLineClick}
            handleTransferClick={handleTransferClick}
            handleAdvanceClick={handleAdvanceClick}
            handleChangeDirectionClick={handleChangeDirectionClick}
            handleResetClick={handleResetClick}
        />
    )
}

export default ConductorMode
