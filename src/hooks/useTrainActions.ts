import { RefObject, useCallback, useMemo } from 'react'

import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'
import { Direction, LineName } from '../logic/LineManager'
import { DailyChallenge } from '../logic/DailyChallenge'

type UseTrainActionsParams = {
    trainRef: RefObject<Train>
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    gameState: GameState
    setGameState: (gs: GameState) => void
    isDailyChallenge?: boolean
}

export default function useTrainActions({ trainRef, setTrain, gameState, setGameState, isDailyChallenge }: UseTrainActionsParams) {
    const checkForWin = useCallback(
        (train: Train) => {
            if (gameState.checkWin(train.getCurrentStation())) {
                if (isDailyChallenge) {
                    DailyChallenge.saveScore(gameState.playerScore)
                }

                setGameState(
                    Object.assign(new GameState(), {
                        ...gameState,
                        isWon: true,
                        isDailyChallengeCompleted: DailyChallenge.isAlreadyCompleted(),
                    })
                )
            }
        },
        [gameState, setGameState, isDailyChallenge]
    )

    const advanceStation = useCallback(
        (numAdvanceStations: number = 1) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('attempted to advanceStation - Train object is null')

            const nextTrain = currentTrain.clone()

            const isAdvanced: boolean = nextTrain.advanceStation(numAdvanceStations)
            if (!isAdvanced) return

            gameState.playerScore.incrementAdvanceCount(numAdvanceStations)
            setTrain(nextTrain)
            checkForWin(nextTrain)
        },
        [trainRef, setTrain, checkForWin, gameState.playerScore]
    )

    const transfer = useCallback(
        async (transferInput: number | LineName = 0) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('attempted to transfer - Train object is null')

            const nextTrain = currentTrain.clone()
            const currentStation = nextTrain.getCurrentStation()

            const selectedLine: LineName = typeof transferInput === 'number' ? currentStation.getTransfers()[transferInput] : transferInput
            const isValidTransfer: boolean = await nextTrain.transferToLine(selectedLine, currentStation)

            if (selectedLine && isValidTransfer) {
                gameState.playerScore.incrementTransferCount()
                setTrain(nextTrain)
                checkForWin(nextTrain)
            }
        },
        [trainRef, setTrain, gameState.playerScore]
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

    return useMemo(
        () => ({
            advanceStation,
            transfer,
            changeDirection,
        }),
        [advanceStation, transfer, changeDirection]
    )
}
