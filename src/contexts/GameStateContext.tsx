import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { GameState } from '../logic/GameState'

interface GameStateContextProps {
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const GameStateContext = createContext<GameStateContextProps | undefined>(undefined)

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
    const [gameState, setGameState] = useState(() => new GameState())

    const value = useMemo(() => ({ gameState, setGameState }), [gameState, setGameState])

    return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
}

export const useGameStateContext = () => {
    const context = useContext(GameStateContext)
    if (context === undefined) {
        throw new Error('useGameStateContext must be used within a GameStateProvider')
    }
    return context
}
// export const useGameStateContext = <T,>(selector: (state: GameStateContextProps) => T): T => {
//     const context = useContextSelector(GameStateContext, (state) => {
//         if (state === undefined) {
//             throw new Error('useGameStateContext must be used within a GameStateProvider')
//         }
//         return selector(state)
//     })

//     return context
// }
