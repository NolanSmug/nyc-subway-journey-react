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
            if (gameState.checkWin(train.getCurrentStation())) {
                setGameState(Object.assign(new GameState(), { ...gameState, isWon: true }))
            }
        },
        [gameState, setGameState]
    )

    const advanceStation = useCallback(
        (numAdvanceStations: number) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('Train object is null')

            if (enableServiceDisruptions) {
                let tempId: string | null = currentTrain.getNextStationId(numAdvanceStations)
                const currentLine: LineName = currentTrain.getLine()

                while (tempId && gameState.isStationDisabled(currentLine, tempId)) {
                    numAdvanceStations++
                    tempId = currentTrain.getNextStationId(numAdvanceStations)
                }
            }

            const nextTrain: Train = currentTrain.clone()

            if (numAdvanceStations > 1) {
                nextTrain.advanceStationInc(numAdvanceStations)
            } else {
                nextTrain.advanceStation()
            }

            setTrain(nextTrain)
            checkForWin(nextTrain)
        },
        [trainRef, setTrain, checkForWin, gameState, enableServiceDisruptions]
    )

    const transfer = useCallback(
        async (transferInput: number | LineName) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('Train object is null')

            const currentStation = currentTrain.getCurrentStation()

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

            if (enableServiceDisruptions && gameState.isLineSuspended(selectedLine)) {
                return
            }

            const nextTrain = currentTrain.clone()
            const isValidTransfer = await nextTrain.transferToLine(selectedLine, currentStation)

            // DO THE TRANSFER
            if (isValidTransfer) {
                setTrain(nextTrain)
            }
        },
        [trainRef, setTrain, gameState, enableServiceDisruptions]
    )

    const changeDirection = useCallback(
        (direction?: Direction): void | Direction => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('Train object is null')

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
