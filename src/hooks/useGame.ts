import { useCallback } from 'react'

import { useTrainContext } from '../contexts/TrainContext'
import { useGameStateContext } from '../contexts/JourneyContext'
import { useUIContext } from '../contexts/UIContext'
import { useSettingsContext } from '../contexts/SettingsContext'

import { Game } from '../logic/Game'
// import { GameState } from '../logic/GameState'
// import { Score } from '../logic/Score'
import { Station as StationClass } from '../logic/StationManager'

// const getDailyScoreSafe = async (game: Game): Promise<Score | null> => {
//     try {
//         return await game.fetchDailyScore()
//     } catch (error) {
//         console.warn('Error fetching optimal score:', error)
//         return null
//     }
// }

export function useGame() {
    const setJourney = useGameStateContext((state) => state.setJourney)
    const setTrain = useTrainContext((state) => state.setTrain)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    const initializeGame = useCallback(async () => {
        try {
            await StationClass.initializeAllStations()
            const newGame = new Game()

            await newGame.runGame(isDailyChallenge)

            setTrain(newGame.train)
            setJourney(newGame.journey)
            setIsTransferMode(false)

            // if (isDailyChallenge) {
            //     const score = await getDailyScoreSafe(newGame)
            //     if (score !== null) {
            //         setJourney((prev) => Object.assign(new GameState(), { ...prev, optimalScore: score }))
            //     }
            // }
        } catch (error) {
            console.error('Error initializing game (useGame()):', error)
        }
    }, [isDailyChallenge, setTrain, setJourney, setIsTransferMode])

    return { initializeGame }
}
