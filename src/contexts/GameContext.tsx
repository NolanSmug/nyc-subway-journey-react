import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { Train } from '../logic/TrainManager'
import { GameState } from '../logic/GameState'
import { Station as StationClass } from '../logic/StationManager'
import { Game } from '../logic/Game'
import { useUIContext } from './UIContext'
import { lineToLineColor } from '../components/UpcomingStations'

interface GameContextProps {
    train: Train
    gameState: GameState
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    initializeGame: () => Promise<void>
}

const GameContext = createContext<GameContextProps | undefined>(undefined)

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [train, setTrain] = useState<Train>(new Train())
    const [gameState, setGameState] = useState<GameState>(new GameState())

    const { setIsTransferMode, setCurrentLineColor } = useUIContext()

    const initializeGame = useCallback(async () => {
        //unsure is useCallback is necessary
        try {
            await StationClass.initializeAllStations()
            let newGame = new Game()
            await newGame.runGame()

            setIsTransferMode(false)
            setTrain(newGame.train)
            setGameState(newGame.gameState)
            setCurrentLineColor(lineToLineColor(newGame.train.getLine()))
            console.log('initialized!')
        } catch (error) {
            console.error('Error initializing game:', error)
        }
    }, [setIsTransferMode, setTrain, setGameState, setCurrentLineColor])

    return (
        <GameContext.Provider value={{ train, setTrain, gameState, setGameState, initializeGame }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGameContext = () => {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider')
    }
    return context
}
