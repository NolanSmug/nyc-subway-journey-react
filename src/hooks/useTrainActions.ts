import { useCallback } from 'react'
import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'
import { Direction, LineName } from '../logic/LineManager'
import { GameMode } from '../contexts/SettingsContext'

type UseTrainActionsParams = {
    train: Train
    gameState: GameState
    updateTrainObject: (t: Partial<Train>) => void
    setGameState: (gs: GameState) => void
    gameMode: GameMode
    passengerIsWalking?: boolean
}

export default function useTrainActions({
    train,
    gameState,
    updateTrainObject,
    setGameState,
    gameMode,
    passengerIsWalking,
}: UseTrainActionsParams) {
    const checkForWin = useCallback(() => {
        if (train.getCurrentStation().equals(gameState.destinationStation)) {
            setGameState(Object.assign(new GameState(), { ...gameState, isWon: true }))
        }
    }, [gameState, train, setGameState])

    const advanceStation = useCallback(
        (numAdvanceStations: number) => {
            if (!train) throw new Error('attempted to advanceStation - Train object is null')
            if (passengerIsWalking && process.env.REACT_APP_USE_DEV_API === 'true') return

            if (numAdvanceStations > 1 && gameMode === GameMode.CONDUCTOR) {
                updateTrainObject({ ...train.advanceStationInc(numAdvanceStations) })
            } else {
                updateTrainObject({ ...train.advanceStation() })
            }

            checkForWin()
        },
        [train, passengerIsWalking, gameMode, updateTrainObject, checkForWin]
    )

    const transfer = useCallback(
        async (transferInput: number | LineName) => {
            if (!train) throw new Error('attempted to transfer - Train object is null')
            if (passengerIsWalking) return

            const currentStation = train.getCurrentStation()

            let selectedLine: LineName | undefined
            if (typeof transferInput === 'number') {
                selectedLine = currentStation.getTransfers()[transferInput]
            } else {
                selectedLine = transferInput
            }

            if (!selectedLine) {
                console.error(`${selectedLine} not found at ${currentStation}`)
                return
            }

            // DO THE TRANSFER
            if (await train.transferToLine(selectedLine, currentStation)) {
                updateTrainObject({ ...train })
            }
        },
        [train, updateTrainObject]
    )

    const changeDirection = useCallback(
        (direction?: Direction) => {
            if (!train) throw new Error('attempted to changeDirection - Train object is null')
            if (passengerIsWalking) return

            if (direction === undefined) {
                updateTrainObject({ ...train.reverseDirection() }) // if no input, reverse
                return
            }

            updateTrainObject({ ...train.setDirection(direction) })
        },
        [train, passengerIsWalking, updateTrainObject]
    )

    return {
        advanceStation,
        transfer,
        changeDirection,
    }
}
