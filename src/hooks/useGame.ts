import { useCallback } from 'react'

import { useTrainContext } from '../contexts/TrainContext'
import { useJourneyContext } from '../contexts/JourneyContext'
import { useUIContext } from '../contexts/UIContext'
import { useSettingsContext } from '../contexts/SettingsContext'

import { Game } from '../logic/Game'
import { initializeSubwayData } from '../logic/subwayMap'

export default function useGame() {
    const setJourney = useJourneyContext((state) => state.setJourney)
    const setTrain = useTrainContext((state) => state.setTrain)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    const initializeGame = useCallback(async () => {
        try {
            await initializeSubwayData()
            const newGame = new Game()

            newGame.runGame(isDailyChallenge)

            setTrain(newGame.train)
            setJourney(newGame.journey)
            setIsTransferMode(false)
        } catch (error) {
            console.error('Error initializing game (useGame()):', error)
        }
    }, [isDailyChallenge, setTrain, setJourney, setIsTransferMode])

    return { initializeGame }
}
