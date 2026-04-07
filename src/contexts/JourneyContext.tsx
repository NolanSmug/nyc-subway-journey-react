import { useState, ReactNode, useMemo } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'
import { Journey } from '../logic/Journey'

interface JourneyContextProps {
    journey: Journey
    setJourney: React.Dispatch<React.SetStateAction<Journey>>
}

const JourneyContext = createContext<JourneyContextProps | undefined>(undefined)

export const JourneyProvider = ({ children }: { children: ReactNode }) => {
    const [journey, setJourney] = useState(() => new Journey())

    const value = useMemo(() => ({ journey, setJourney }), [journey, setJourney])

    return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export const useJourneyContext = <T,>(selector: (state: JourneyContextProps) => T): T => {
    const context = useContextSelector(JourneyContext, (state) => {
        if (state === undefined) {
            throw new Error('useJourneyContext must be used within a JourneyProvider')
        }
        return selector(state)
    })

    return context
}
