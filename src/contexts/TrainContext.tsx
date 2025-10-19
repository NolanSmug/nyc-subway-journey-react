import React, { useState, ReactNode, useCallback, useMemo } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'
import { Train } from '../logic/TrainManager'
import useTrainActions from '../hooks/useTrainActions'
import { useGameStateContext } from './GameStateContext'
import { GameMode, useSettingsContext } from './SettingsContext'
import { useUIContext } from './UIContext'
import { PassengerState } from '../hooks/usePassengerActions'

type TrainActions = ReturnType<typeof useTrainActions>

interface TrainContextProps {
    train: Train
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    actions: TrainActions
    updateTrainObject: (updates: Partial<Train>) => void
}

const TrainContext = createContext<TrainContextProps | undefined>(undefined)

export const TrainProvider = ({ children }: { children: ReactNode }) => {
    const [train, setTrain] = useState(() => new Train())

    const { gameState, setGameState } = useGameStateContext()
    const gameMode = useSettingsContext((state) => state.gameMode)
    const passengerState = useUIContext((state) => state.passengerState)

    const updateTrainObject = useCallback((updates: Partial<Train>) => {
        setTrain((prevTrain) => {
            const newTrain = Object.create(Object.getPrototypeOf(prevTrain))
            return Object.assign(newTrain, prevTrain, updates)
        })
    }, [])

    const actions = useTrainActions({
        train,
        gameState,
        updateTrainObject,
        setGameState,
        gameMode,
        passengerIsWalking: gameMode === GameMode.RIDER && passengerState === PassengerState.WALKING,
    })

    const value = useMemo(() => ({ train, actions, updateTrainObject, setTrain }), [train, updateTrainObject, actions])

    return <TrainContext.Provider value={value}>{children}</TrainContext.Provider>
}

export const useTrainContext = <T,>(selector: (state: TrainContextProps) => T): T => {
    const context = useContextSelector(TrainContext, (state) => {
        if (state === undefined) {
            throw new Error('useTrainContext must be used within a TrainProvider')
        }
        return selector(state)
    })
    return context
}
