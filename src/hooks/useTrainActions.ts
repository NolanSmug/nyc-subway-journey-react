import { RefObject, useCallback } from 'react'

import { GameDifficulty, GameMode } from '../contexts/SettingsContext'

import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'
import { Direction, LineName } from '../logic/LineManager'

type UseTrainActionsParams = {
    trainRef: RefObject<Train>
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    gameState: GameState
    setGameState: (gs: GameState) => void
    gameMode: GameMode
    gameDifficulty: GameDifficulty
}

export default function useTrainActions({ trainRef, setTrain, gameState, setGameState, gameMode, gameDifficulty }: UseTrainActionsParams) {
    const enableServiceDisruptions: boolean = gameDifficulty === GameDifficulty.NEW_YORKER

    const checkForWin = useCallback(
        (train: Train) => {
            if (train.getCurrentStation().equals(gameState.destinationStation)) {
                setGameState(Object.assign(new GameState(), { ...gameState, isWon: true }))
            }
        },
        [gameState, setGameState]
    )

    const advanceStation = useCallback(
        (numAdvanceStations: number) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('attempted to advanceStation - Train object is null')

            const nextTrain = currentTrain.clone()

            // if (serviceDisruptionsEnabled) {
            //     handleServiceDisruptionAdvance() // TODO: something like this. return early? happy path where?
            //     const nextValidIndex: number = nextTrain.advanceStationInc()
            // }

            if (numAdvanceStations > 1 && gameMode === GameMode.CONDUCTOR) {
                nextTrain.advanceStationInc(numAdvanceStations)
            } else {
                nextTrain.advanceStation()
            }

            setTrain(nextTrain)
            checkForWin(nextTrain)
        },
        [trainRef, setTrain, gameMode, checkForWin]
    )

    const transfer = useCallback(
        async (transferInput: number | LineName) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('attempted to transfer - Train object is null')

            const nextTrain = currentTrain.clone()
            const currentStation = nextTrain.getCurrentStation()

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

            const isValidTransfer = await nextTrain.transferToLine(selectedLine, currentStation)

            // DO THE TRANSFER
            if (isValidTransfer) {
                setTrain(nextTrain)
            }
        },
        [trainRef, setTrain]
    )

    const changeDirection = useCallback(
        (direction?: Direction): void | Direction => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('attempted to changeDirection - Train object is null')

            if (currentTrain.getDirection() === direction) return

            const nextTrain = currentTrain.clone()

            if (direction === undefined) {
                nextTrain.reverseDirection() // if no input, reverse
            } else {
                nextTrain.setDirection(direction)
            }

            setTrain(nextTrain)

            return nextTrain.getDirection() // return the new direction so RiderMode knows where to move Passenger
        },
        [trainRef, setTrain]
    )

    return {
        advanceStation,
        transfer,
        changeDirection,
    }
}
