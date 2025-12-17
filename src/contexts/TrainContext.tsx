import React, { useState, ReactNode, useMemo, useRef, useEffect } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'
import { useGameStateContext } from './GameStateContext'
import { useSettingsContext } from './SettingsContext'

import useTrainActions from '../hooks/useTrainActions'
import { Train } from '../logic/TrainManager'

type TrainActions = ReturnType<typeof useTrainActions>

interface TrainContextProps {
    train: Train
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    actions: TrainActions
}

const TrainContext = createContext<TrainContextProps | undefined>(undefined)

export const TrainProvider = ({ children }: { children: ReactNode }) => {
    const [train, setTrain] = useState(() => new Train())

    const trainRef = useRef(train)

    useEffect(() => {
        trainRef.current = train
    }, [train])

    const { gameState, setGameState } = useGameStateContext()
    const gameMode = useSettingsContext((state) => state.gameMode)
    const gameDifficulty = useSettingsContext((state) => state.gameDifficulty)

    const actions = useTrainActions({
        trainRef,
        setTrain,
        gameState,
        setGameState,
        gameMode,
        gameDifficulty,
    })

    const value = useMemo(() => ({ train, actions, setTrain }), [train, actions])

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
