import React, { useState, ReactNode, useMemo, useRef } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'
import { useGameStateContext } from './GameStateContext'

import useTrainActions from '../hooks/useTrainActions'
import { Train } from '../logic/TrainManager'
import { useSettingsContext } from './SettingsContext'

type TrainActions = ReturnType<typeof useTrainActions>

interface TrainContextProps {
    train: Train
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    actions: TrainActions
}

const TrainContext = createContext<TrainContextProps | undefined>(undefined)

export const TrainProvider = ({ children }: { children: ReactNode }) => {
    const [train, setTrain] = useState<Train>(() => new Train())
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    const trainRef: React.RefObject<Train> = useRef(train)

    trainRef.current = train

    const { setGameState } = useGameStateContext()

    const actions = useTrainActions({
        trainRef,
        setTrain,
        setGameState,
        isDailyChallenge,
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
