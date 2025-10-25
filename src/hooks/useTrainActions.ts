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
}

export default function useTrainActions({ train, gameState, updateTrainObject, setGameState, gameMode }: UseTrainActionsParams) {
    const checkForWin = useCallback(() => {
        if (train.getCurrentStation().equals(gameState.destinationStation)) {
            setGameState(Object.assign(new GameState(), { ...gameState, isWon: true }))
        }
    }, [gameState, train, setGameState])

    const advanceStation = useCallback(
        (numAdvanceStations: number) => {
            if (!train) throw new Error('attempted to advanceStation - Train object is null')

            if (numAdvanceStations > 1 && gameMode === GameMode.CONDUCTOR) {
                updateTrainObject(train.advanceStationInc(numAdvanceStations))
            } else {
                updateTrainObject(train.advanceStation())
            }

            checkForWin()
        },
        [train, gameMode, updateTrainObject, checkForWin]
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

            // DO THE TRANSFER
            if (await train.transferToLine(selectedLine, currentStation)) {
                updateTrainObject(train)
            }
        },
        [train, updateTrainObject]
    )

    const changeDirection = useCallback(
        (direction?: Direction) => {
            if (!train) throw new Error('attempted to changeDirection - Train object is null')

            // note: undefined here because passing in NULL_DIRECTION should literally make the train's direction NULL (for rider mode)
            if (direction === undefined) {
                updateTrainObject(train.reverseDirection()) // if no input, reverse
                return
            }

            updateTrainObject(train.setDirection(direction))
        },
        [train, updateTrainObject]
    )

    return {
        advanceStation,
        transfer,
        changeDirection,
    }
}
