import { useState, ReactNode, useMemo, useRef, RefObject } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'
import { useJourneyContext } from './JourneyContext'
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
    const [train, setTrain] = useState<Train>(() => new Train())
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    const trainRef: RefObject<Train> = useRef(train)

    trainRef.current = train

    const setJourney = useJourneyContext((state) => state.setJourney)
    const actions = useTrainActions({
        trainRef,
        setTrain,
        setJourney,
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
