import { useCallback } from 'react'

import { GameMode } from '../contexts/SettingsContext'

import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'
import { Direction, LineName } from '../logic/LineManager'

type UseTrainActionsParams = {
    train: Train
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    gameState: GameState
    setGameState: (gs: GameState) => void
    gameMode: GameMode
}

export default function useTrainActions({ train, setTrain, gameState, setGameState, gameMode }: UseTrainActionsParams) {
    const checkForWin = useCallback(() => {
        if (train.getCurrentStation().equals(gameState.destinationStation)) {
            setGameState(Object.assign(new GameState(), { ...gameState, isWon: true }))
        }
    }, [gameState, train, setGameState])

    const advanceStation = useCallback(
        (numAdvanceStations: number) => {
            if (!train) throw new Error('attempted to advanceStation - Train object is null')

            if (numAdvanceStations > 1 && gameMode === GameMode.CONDUCTOR) {
                train.advanceStationInc(numAdvanceStations)
            } else {
                train.advanceStation()
            }

            setTrain(train.clone())
            checkForWin()
        },
        [train, setTrain, gameMode, checkForWin]
    )

    const transfer = useCallback(
        async (transferInput: number | LineName) => {
            if (!train) throw new Error('attempted to transfer - Train object is null')

            const currentStation = train.getCurrentStation()

            let selectedLine: LineName
            if (typeof transferInput === 'number') {
                selectedLine = currentStation.getTransfers()[transferInput]
            } else {
                selectedLine = transferInput
            }

            if (!selectedLine) {
                console.error(`${selectedLine} not found at ${currentStation}`)
                return
            }

            const isValidTransfer = await train.transferToLine(selectedLine, currentStation)

            // DO THE TRANSFER
            if (isValidTransfer) {
                setTrain(train.clone())
            }
        },
        [train, setTrain]
    )

    const changeDirection = useCallback(
        (direction?: Direction) => {
            if (!train) throw new Error('attempted to changeDirection - Train object is null')

            // note: undefined here because passing in NULL_DIRECTION should literally make the train's direction NULL (for rider mode)
            if (direction === undefined) {
                train.reverseDirection() // if no input, reverse
            } else {
                train.setDirection(direction)
            }

            setTrain(train.clone())
        },
        [train, setTrain]
    )

    return {
        advanceStation,
        transfer,
        changeDirection,
    }
}
