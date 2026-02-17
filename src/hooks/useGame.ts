import { useCallback } from 'react'

import { useTrainContext } from '../contexts/TrainContext'
import { useGameStateContext } from '../contexts/GameStateContext'
import { useUIContext } from '../contexts/UIContext'
import { useSettingsContext } from '../contexts/SettingsContext'

import { Game } from '../logic/Game'
import { Score } from '../logic/Score'
import { Station as StationClass } from '../logic/StationManager'

const getDailyScoreSafe = async (game: Game): Promise<Score | null> => {
    try {
        return await game.fetchDailyScore()
    } catch (error) {
        console.warn('Error fetching optimal score:', error)
        return null
    }
}

export function useGame() {
    const { setGameState } = useGameStateContext()
    const setTrain = useTrainContext((state) => state.setTrain)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    const initializeGame = useCallback(async () => {
        try {
            await StationClass.initializeAllStations()
            const newGame = new Game()

            await newGame.runGame(isDailyChallenge)

            setTrain(newGame.train)
            setGameState(newGame.gameState)
            setIsTransferMode(false)

            if (isDailyChallenge) {
                const score = await getDailyScoreSafe(newGame)
                if (score !== null) {
                    newGame.gameState.optimalScore = score
                }
            }
        } catch (error) {
            console.error('Error initializing game (useGame()):', error)
        }
    }, [isDailyChallenge, setTrain, setGameState, setIsTransferMode])

    return { initializeGame }
}
