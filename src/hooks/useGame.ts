import { useCallback } from 'react'

import { useTrainContext } from '../contexts/TrainContext'
import { useGameStateContext } from '../contexts/GameStateContext'
import { useUIContext } from '../contexts/UIContext'
import { useSettingsContext } from '../contexts/SettingsContext'

import { Game } from '../logic/Game'
import { Station as StationClass } from '../logic/StationManager'

export function useGame() {
    const { setGameState } = useGameStateContext()
    const setTrain = useTrainContext((state) => state.setTrain)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    const initializeGame = useCallback(async () => {
        try {
            await StationClass.initializeAllStations()
            let newGame = new Game()
            await newGame.runGame(isDailyChallenge)

            setIsTransferMode(false)
            setTrain(newGame.train)
            setGameState(newGame.gameState)
        } catch (error) {
            console.error('Error initializing game:', error)
        }
    }, [isDailyChallenge, setTrain, setGameState, setIsTransferMode])

    return { initializeGame }
}
