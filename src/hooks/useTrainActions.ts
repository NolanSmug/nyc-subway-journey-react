import { useCallback } from 'react'
import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'

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
    const transfer = useCallback(
        async (transferIndex: number) => {
            if (transferIndex === undefined) {
                console.log('No transfer index found')
                return
            }

            const selectedLine = train.getCurrentStation().getTransfers()[transferIndex]

            if (await train.transferToLine(selectedLine, train.getCurrentStation())) {
                train.setLine(selectedLine)
                train.setCurrentStation(train.getCurrentStation())
                // if (conductorMode) train.setDirection(defaultDirectionToggle)
                train.updateTrainState()
            }
            updateTrainObject({ ...train })
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
