import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'
import { Train } from '../logic/TrainManager'
import { GameState } from '../logic/GameState'
import { Station as StationClass } from '../logic/StationManager'
import { Game } from '../logic/Game'
import { useUIContext } from './UIContext'

interface GameContextProps {
    train: Train
    gameState: GameState
    updateTrainObject: (updates: Partial<Train>) => void
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    initializeGame: () => Promise<void>
}

const GameContext = createContext<GameContextProps | undefined>(undefined)

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [train, setTrain] = useState<Train>(() => new Train())
    const [gameState, setGameState] = useState<GameState>(() => new GameState())

    const { setIsTransferMode, setPassengerPosition } = useUIContext()

    const initializeGame = useCallback(async () => {
        try {
            await StationClass.initializeAllStations()
            let newGame = new Game()
            await newGame.runGame()

            // setPassengerPosition(CENTER_PLATFORM_POS)
            setIsTransferMode(false)
            setTrain(newGame.train)
            setGameState(newGame.gameState)
        } catch (error) {
            console.error('Error initializing game:', error)
        }
    }, [setIsTransferMode, setTrain, setGameState])

    // this function is used for ensuring we re-render after train object actions
    const updateTrainObject = useCallback((updates: Partial<Train>) => {
        // "reset" train object
        setTrain(() => {
            const newTrain = new Train()
            Object.assign(newTrain, updates) // create a new train with updated fields
            return newTrain
        })
    }, [])

    const value = useMemo(
        () => ({
            train,
            gameState,
            updateTrainObject,
            setTrain,
            setGameState,
            initializeGame,
        }),
        [train, gameState, updateTrainObject, setTrain, setGameState, initializeGame]
    )

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGameContext = () => {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider')
    }
    return context
}
