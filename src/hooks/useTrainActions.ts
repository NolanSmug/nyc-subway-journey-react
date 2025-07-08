import { useCallback } from 'react'
import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'
import { LineName } from '../logic/LineManager'

type UseTrainActionsParams = {
    train: Train
    gameState: GameState
    conductorMode: boolean
    updateTrainObject: (t: Partial<Train>) => void
    setGameState: (gs: GameState) => void
}

export default function useTrainActions({
    train,
    gameState,
    conductorMode,
    updateTrainObject,
    setGameState,
}: UseTrainActionsParams) {
    const checkForWin = useCallback(() => {
        const winState = gameState.checkWin(train.getCurrentStation())
        if (winState) {
            setGameState(gameState)
        }
    }, [gameState, train, setGameState])

    // ADVANCING STATIONS
    const advanceStation = useCallback(
        (numAdvanceStations: number) => {
            if (!train) throw new Error('repOK failed on advanceaction')

            if (numAdvanceStations > 1 && conductorMode) {
                updateTrainObject({ ...train.advanceStationInc(numAdvanceStations) })
            } else {
                updateTrainObject({ ...train.advanceStation() })
            }

            checkForWin()
        },
        [train, conductorMode, updateTrainObject, checkForWin]
    )

    // TRANSFERRING LINES
    const transfer: {
        // can either transfer by index, or specific line
        (index: number): Promise<void>
        (line: LineName): Promise<void>
    } = useCallback(
        async (transferInput: number | LineName) => {
            let selectedLine: LineName | undefined

            if (typeof transferInput === 'number') {
                selectedLine = train.getCurrentStation().getTransfers()[transferInput]
            } else {
                selectedLine = transferInput
            }

            if (!selectedLine) {
                console.error(`${selectedLine} not found at ${train.getCurrentStation()}`)
                return
            }

            // DO THE TRANSFER
            if (await train.transferToLine(selectedLine, train.getCurrentStation())) {
                updateTrainObject({ ...train })
            }
        },
        [train, updateTrainObject]
    )

    // CHANGING DIRECTION
    const changeDirection = useCallback(() => {
        if (!train) throw new Error('repOK failed on change direction action')
        updateTrainObject({ ...train.reverseDirection() })
    }, [train, updateTrainObject])

    return {
        advanceStation,
        transfer,
        changeDirection,
    }
}
