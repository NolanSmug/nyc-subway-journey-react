import { MutableRefObject, useCallback, useMemo } from 'react'

import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'
import { Direction, LineName } from '../logic/LineManager'
import { DailyChallenge } from '../logic/DailyChallenge'

type UseTrainActionsParams = {
    trainRef: MutableRefObject<Train>
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    isDailyChallenge?: boolean
}

export default function useTrainActions({ trainRef, setTrain, setGameState, isDailyChallenge }: UseTrainActionsParams) {
    const checkForWin = useCallback(
        (train: Train) => {
            setGameState((prevGameState) => {
                if (!prevGameState.checkWin(train.getCurrentStation())) {
                    return prevGameState
                }

                if (isDailyChallenge) {
                    DailyChallenge.saveScore(prevGameState.playerScore)
                }

                return Object.assign(new GameState(), {
                    ...prevGameState,
                    isWon: true,
                    isDailyChallengeCompleted: DailyChallenge.isAlreadyCompleted(),
                })
            })
        },
        [setGameState, isDailyChallenge]
    )

    const advanceStation = useCallback(
        (numAdvanceStations: number = 1) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('attempted to advanceStation - Train object is null')

            const nextTrain = currentTrain.clone()

            const isAdvanced: boolean = nextTrain.advanceStation(numAdvanceStations)
            if (!isAdvanced) return

            setGameState((prevGameState) => {
                prevGameState.playerScore.incrementAdvanceCount(numAdvanceStations)
                return Object.assign(new GameState(), prevGameState)
            })

            setTrain(nextTrain)
            trainRef.current = nextTrain
            checkForWin(nextTrain)
        },
        [trainRef, setTrain, setGameState, checkForWin]
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
                setGameState((prevGameState) => {
                    prevGameState.playerScore.incrementTransferCount()
                    return Object.assign(new GameState(), prevGameState)
                })
                setTrain(nextTrain)
                trainRef.current = nextTrain
                checkForWin(nextTrain)
            }
        },
        [trainRef, setTrain, setGameState, checkForWin]
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
            trainRef.current = nextTrain

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
