import { RefObject, useCallback, useMemo } from 'react'

import { Journey } from '../logic/Journey'
import { Train } from '../logic/TrainManager'
import { Direction, LineName } from '../logic/LineManager'
import { DailyChallenge } from '../logic/DailyChallenge'
import { Station } from '../logic/StationManager'

type UseTrainActionsParams = {
    trainRef: RefObject<Train>
    setTrain: React.Dispatch<React.SetStateAction<Train>>
    setJourney: React.Dispatch<React.SetStateAction<Journey>>
    isDailyChallenge?: boolean
}

export default function useTrainActions({ trainRef, setTrain, setJourney, isDailyChallenge }: UseTrainActionsParams) {
    const updateGameProgress = useCallback(
        (prevState: Journey, currentStation: Station) => {
            // Clone the state to keep it immutable
            const nextState = Object.assign(new Journey(), prevState)

            // Check if the current move resulted in a win
            if (nextState.checkWin(currentStation)) {
                if (isDailyChallenge) {
                    DailyChallenge.saveScore(nextState.playerScore)
                }
                nextState.isWon = true
            }

            return nextState
        },
        [isDailyChallenge]
    )

    const advanceStation = useCallback(
        (numAdvanceStations: number = 1) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('Train is null')

            const nextTrain = currentTrain.clone()
            if (!nextTrain.advanceStation(numAdvanceStations)) return

            setTrain(nextTrain)
            trainRef.current = nextTrain

            setJourney((prev) => {
                prev.playerScore.incrementAdvanceCount(numAdvanceStations)
                return updateGameProgress(prev, nextTrain.getCurrentStation())
            })
        },
        [trainRef, setTrain, setJourney, updateGameProgress]
    )

    const transfer = useCallback(
        async (toLine: LineName) => {
            const currentTrain = trainRef.current
            if (!currentTrain) throw new Error('attempted to transfer - Train object is null')

            const nextTrain = currentTrain.clone()
            const currentStation = nextTrain.getCurrentStation()

            const isValidTransfer: boolean = nextTrain.transferToLine(toLine, currentStation)

            if (toLine && isValidTransfer) {
                setTrain(nextTrain)
                trainRef.current = nextTrain

                setJourney((prev) => {
                    prev.playerScore.incrementTransferCount()
                    return updateGameProgress(prev, currentStation)
                })
            }
        },
        [trainRef, setTrain, setJourney, updateGameProgress]
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
